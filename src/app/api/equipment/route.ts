import { type NextRequest, NextResponse } from "next/server"
import type { EquipmentItem } from "@/types"

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    // For now, we'll return a mock response
    const equipment = [
      {
        id: 1,
        name: "Celestron CGX Mount",
        type: "Mount",
        status: "Connected",
        driver: "ASCOM Celestron Driver",
        details: {
          model: "CGX",
          firmwareVersion: "1.9.13",
          connectionType: "USB",
          trackingRate: "Sidereal",
        },
      },
      {
        id: 2,
        name: "ZWO ASI294MC Pro",
        type: "Camera",
        status: "Connected",
        driver: "ASCOM ZWO Camera Driver",
        details: {
          sensor: "Sony IMX294",
          pixelSize: "4.63µm",
          resolution: "4144 x 2822",
          cooling: "Yes",
        },
      },
    ]

    return NextResponse.json({ equipment })
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the equipment data
    if (!data.name || !data.type) {
      return NextResponse.json({ error: "Missing required fields: name, type" }, { status: 400 })
    }

    // In a real application, this would save to a database
    // For now, we'll just return a mock response with an ID
    const newEquipment: EquipmentItem = {
      id: Date.now(),
      name: data.name,
      type: data.type,
      status: data.status || "Disconnected",
      driver: data.driver || "",
      details: data.details || {},
    }

    return NextResponse.json({
      success: true,
      message: "Equipment added successfully",
      equipment: newEquipment,
    })
  } catch (error) {
    console.error("Error adding equipment:", error)
    return NextResponse.json({ error: "Failed to add equipment" }, { status: 500 })
  }
}

