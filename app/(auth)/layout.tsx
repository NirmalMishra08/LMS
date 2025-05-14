const authLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="w-full max-w-md p-4 bg-white rounded shadow-2xs">
                {children}
            </div>
        </div>
    )
}

export default authLayout;