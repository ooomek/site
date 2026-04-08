export default function AppLogo() {
    return (
        <>
            <img
                src="/images/logo.png"
                alt="МЭК"
                className="h-8 w-8 rounded-md object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    МЭК Админка
                </span>
            </div>
        </>
    );
}
