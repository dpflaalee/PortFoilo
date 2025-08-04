import React from "react";
import AppLayout from "../../components/AppLayout";
import FindForm from "../../components/user/FindForm";
import { VerticalAlignMiddleOutlined } from "@ant-design/icons";
const find = () => {
    return (
            <div 
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh", // 화면 전체 높이 확보
            }}
            >
                <FindForm />
            </div>
    );
}

export default find;