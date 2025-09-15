"use client"

import {Container, Typography, Button} from "@mui/material"
import {useEffect, useState} from "react";

export default function Home() {
    const [message, setMessage] = useState<string>("Loading...")
    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/hello")
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setMessage(data.message)
            } catch (err) {
                console.error(err)
                setMessage("Error fetching data: ", err)
            }
        }

        fetchMessage()
    }, [])
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Hello Next.js + MUI v6 👋
            </Typography>
            <Button variant="contained" color="primary">
                Click Me
            </Button>

            <Typography variant="body1" sx={{mt: 2}}>
                API Response: {message}
            </Typography>
        </Container>
    )
}
