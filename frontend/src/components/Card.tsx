import { ReactNode } from "react";

interface CardProps{
    children: ReactNode
}

function Card(props: CardProps){
    const {children} = props
    return (
            <div className="card">
                <div className="card-body">{children}</div>
            </div>
            )
}

interface CardBodyProps{
    title: string,
    text?: string
}

export function CardBody(props: CardBodyProps){
    const {title, text} = props;
    return (
        <>
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{text}</h6>
        </>
    )
}

export default Card;
