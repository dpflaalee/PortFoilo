import React from "react";

export default function GroupDropDown({group}){
  return(
    <div className="mt-3 p-3 bg-gray-50 border rounded">
      <h3 className="font-semibold text-sm mb-1">소개</h3>
      <p className="text-sm text-gray-700 mb-2">{group.content}</p> 
    </div>
  )
};