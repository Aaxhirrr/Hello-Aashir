"use client"

import { Works } from "../../components/works"
import { GithubActivity } from "../../components/github-activity"

export default function WorkPage() {
    return (
        <main className="pt-24">
            <Works />
            <GithubActivity />
        </main>
    )
}
