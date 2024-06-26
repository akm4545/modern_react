import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }){
    return (
        <div className="space-y-9">
            <h1>여기는 /grouped-layout/(todos) 입니다.</h1>
            <div>{children}</div>
        </div>
    )
}