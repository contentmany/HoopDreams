import React from "react";
import { NavLink } from "@/lib/router";
const tabs=[ {to:"/play",label:"Dashboard"}, {to:"/league",label:"League"},
            {to:"/team",label:"Team"}, {to:"/social",label:"Social"},
            {to:"/business",label:"Business"}, {to:"/settings",label:"Settings"} ];
export default function BottomNav(){
  return <nav className="tabbar">{tabs.map(t=><NavLink key={t.to} to={t.to} className={({isActive})=>isActive?"active":""}>{t.label}</NavLink>)}</nav>;
}
