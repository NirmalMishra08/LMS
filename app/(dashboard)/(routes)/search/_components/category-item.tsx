"use client"

import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Suspense } from "react";

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
}

function CategoryItemContent({ label, value, icon: Icon }: CategoryItemProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition ease-in-out",
                isSelected && "border-sky-700 text-sky-800 bg-sky-200/20"
            )}
            type="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    );
}

const CategoryItem = (props: CategoryItemProps) => {
    return (
        <Suspense fallback={
            <button
                className="py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1"
                type="button"
                disabled
            >
                {props.icon && <props.icon size={20} />}
                <div className="truncate">{props.label}</div>
            </button>
        }>
            <CategoryItemContent {...props} />
        </Suspense>
    );
};

export default CategoryItem;