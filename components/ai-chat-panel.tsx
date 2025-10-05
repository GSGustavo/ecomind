"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, RotateCcw } from "lucide-react"
import type { Vulnerability, SimulationResult } from "@/lib/types"
import { simulateImprovement } from "@/lib/ai-simulation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  simulation?: SimulationResult
}

interface AIChatPanelProps {
  vulnerabilities: Vulnerability[]
  onSimulationApply: (result: SimulationResult) => void
}

const examplePrompts = [
  "Add more trees in the city center",
  "Improve public transport in the north zone",
  "Reduce vehicle traffic downtown",
  "Enhance water treatment facilities",
]

export function AIChatPanel({ vulnerabilities, onSimulationApply }: AIChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI urban planning assistant. Describe improvements you'd like to simulate, and I'll show you the predicted environmental impact.",
    },
    // {
    //   id: "2",
    //   role: "assistant",
    //   content:
    //     "Hello! I'm your AI urban planning assistant. Describe improvements you'd like to simulate, and I'll show you the predicted environmental impact.",
    // },
    //  {
    //   id: "3",
    //   role: "assistant",
    //   content:
    //     "Hello! I'm your AI urban planning assistant. Describe improvements you'd like to simulate, and I'll show you the predicted environmental impact.",
    // },
    //  {
    //   id: "4",
    //   role: "assistant",
    //   content:
    //     "Hello! I'm your AI urban planning assistant. Describe improvements you'd like to simulate, and I'll show you the predicted environmental impact.",
    // },
  ])
  const [input, setInput] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Run simulation
    const simulation = simulateImprovement(input, vulnerabilities)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've simulated "${simulation.improvement}". Here are the predicted results:

• Air Quality: ${simulation.metrics.airQualityImprovement > 0 ? `+${simulation.metrics.airQualityImprovement}%` : "No change"}
• Heat Reduction: ${simulation.metrics.heatReduction > 0 ? `+${simulation.metrics.heatReduction}%` : "No change"}
• Green Space: ${simulation.metrics.greenSpaceIncrease > 0 ? `+${simulation.metrics.greenSpaceIncrease}%` : "No change"}
• Overall Environmental Score: ${simulation.metrics.overallScore}/100

Click "Apply Simulation" to see the changes on the map.`,
      simulation,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsProcessing(false)

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
  }

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI urban planning assistant. Describe improvements you'd like to simulate, and I'll show you the predicted environmental impact.",
      },
    ])
  }

  return (
    <Card className="flex h-full flex-col overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#0B3D91]" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-[#0B3D91] text-white" : "border border-border bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.content}</p>
                {message.simulation && (
                  <Button
                    size="sm"
                    className="mt-3 w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90"
                    onClick={() => onSimulationApply(message.simulation!)}
                  >
                    Apply Simulation
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg border border-border bg-muted p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Example Prompts */}
      {messages.length === 1 && (
        <div className="border-t border-border p-4">
          <p className="mb-2 text-xs text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleExampleClick(prompt)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs transition-colors hover:bg-accent"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe an improvement..."
            disabled={isProcessing}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isProcessing} className="bg-[#0B3D91]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
