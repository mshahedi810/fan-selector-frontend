"use client"

import CustomerPortal from "@/components/CustomerPortal"
import {FANS_DATA} from "@/data/fans.js"


export default function Page() {
    return <CustomerPortal fans={FANS_DATA} />
}