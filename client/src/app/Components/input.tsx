type props={
    type: string
    name: string
    placeholder: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<props> = (props) => {
    return (
        <input {...props} className={`w-[350px] bg-none border border-black`} />
    );
}
