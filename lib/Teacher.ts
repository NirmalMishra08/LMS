export const isTeacher = async (userId?: string| null) => {

    return userId == process.env.NEXT_PUBLIC_TEACHER_ID;

}