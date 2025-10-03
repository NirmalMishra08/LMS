import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const course = await db.course.findUnique({
            where: { id: courseId, isPublished: true }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });

        if (purchase) {
            return new Response("You have already purchased this course.", { status: 400 });
        }

        if (!course) {
            return new Response("Course not found", { status: 404 });
        }


        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "INR",
                    unit_amount: Math.round(course.price! * 100), // Convert to smallest currency unit
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                },
            },
        ];

        let StripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId: user.id },
            select: {
                stripeCustomerId: true
            }
        })
        if (!StripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses?.[0]?.emailAddress,
                name: user.firstName + " " + user.lastName
            });
            StripeCustomer = await db.stripeCustomer.create({
                data: {
                    stripeCustomerId: customer.id,
                    userId: user.id
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: StripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                userId: user.id,
                courseId: course.id
            }
        });

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });


    } catch (error) {
        console.log("Course ID Checkout Error", error);
        return new Response("Internal Server Error", { status: 500 });
    }

}