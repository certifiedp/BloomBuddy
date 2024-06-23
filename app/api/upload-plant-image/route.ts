import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    console.log("Received image:", image)

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    let base64Image: string
    const bytes = await image.arrayBuffer()
    base64Image = Buffer.from(bytes).toString("base64")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze this plant image. Provide the following information:\n1. pH sensor reading\n2. Moisture sensor reading\n3. Light rating (1-10)\n4. Verbose description of the plant\'s state (e.g., wilted leaves, color issues, deformed leaves, inconsistent leaf size, discolored or soft stems, stunted growth, lack of flowering, poor fruit quality, dark or mushy roots, visible pests, holes in leaves, sticky residue, dry or waterlogged soil, sparse foliage, fungal growth, mold, mildew, unusual spots or streaks on leaves and stems) as well as what kind of plant it is\nFormat the response as JSON without any markdown formatting, adhering to this strict type:\n{\n  "pHReading": number,\n  "moistureReading": number,\n  "lightRating": number,\n  "plantState": string\n}\nEnsure all fields are present and of the correct type.',
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    })

    let result
    try {
      const content = response.choices[0].message.content || "{}"
      result = JSON.parse(content.replace(/```json|```/g, "").trim())
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      console.log("Original:", response.choices[0].message.content)
      return NextResponse.json(
        { error: "Error parsing analysis result" },
        { status: 500 }
      )
    }

    console.log("Analysis result:", result)

    if (
      result.lightRating !== undefined &&
      result.pHReading !== undefined &&
      result.moistureReading !== undefined &&
      result.lightRating >= 0 &&
      result.lightRating <= 10
    ) {
      const updateData: {
        light: number
        description: string
        moisture?: number
        ph?: number
      } = {
        light: result.lightRating,
        description: result.plantState,
      }

      if (result.moistureReading > 0 && result.moistureReading <= 4) {
        updateData.moisture = result.moistureReading
      }

      if (result.pHReading > 0 && result.pHReading <= 14) {
        updateData.ph = result.pHReading
      }

      const { data, error } = await supabase
        .from("plant")
        .update(updateData)
        .eq("id", "48890957-933e-45cf-888f-74096f277ebd")

      if (error) {
        console.error("Error updating plant in Supabase:", error)
        return NextResponse.json(
          { error: "Error updating plant data" },
          { status: 500 }
        )
      }
    } else {
      console.log(
        "Skipping Supabase update due to invalid or missing sensor readings"
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 }
    )
  }
}
