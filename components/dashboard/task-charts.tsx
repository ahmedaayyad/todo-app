"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"
import { formatTime } from "@/lib/utils"
import { BarChart3, PieChart, LineChart, Activity } from "lucide-react"

export function TaskCharts() {
  const { tasks, view } = useAppStore()
  const { theme } = useTheme()

  // Chart refs
  const statusChartRef = useRef<HTMLCanvasElement>(null)
  const priorityChartRef = useRef<HTMLCanvasElement>(null)
  const timelineChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const timeSpentChartRef = useRef<HTMLCanvasElement>(null)
  const productivityGaugeRef = useRef<HTMLCanvasElement>(null)

  // Chart instances
  const statusChartInstance = useRef<Chart | null>(null)
  const priorityChartInstance = useRef<Chart | null>(null)
  const timelineChartInstance = useRef<Chart | null>(null)
  const categoryChartInstance = useRef<Chart | null>(null)
  const timeSpentChartInstance = useRef<Chart | null>(null)
  const productivityGaugeInstance = useRef<Chart | null>(null)

  // Initialize and update charts
  useEffect(() => {
    if (view !== "graph") return

    const textColor = theme === "dark" ? "rgba(229, 231, 235, 0.8)" : "rgba(55, 65, 81, 0.8)"
    const gridColor = theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.8)"
    const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

    // Define modern color palette with gradients
    const chartColors = {
      primary: {
        fill: {
          light: "rgba(79, 70, 229, 0.2)",
          dark: "rgba(79, 70, 229, 0.4)",
        },
        stroke: "rgba(79, 70, 229, 1)",
        gradient: (ctx: CanvasRenderingContext2D, area: { bottom: number; top: number; height: number }) => {
          if (!ctx) return null
          const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
          gradient.addColorStop(0, "rgba(79, 70, 229, 0.0)")
          gradient.addColorStop(1, "rgba(79, 70, 229, 0.5)")
          return gradient
        },
      },
      secondary: {
        fill: {
          light: "rgba(168, 85, 247, 0.2)",
          dark: "rgba(168, 85, 247, 0.4)",
        },
        stroke: "rgba(168, 85, 247, 1)",
        gradient: (ctx: CanvasRenderingContext2D, area: { bottom: number; top: number; height: number }) => {
          if (!ctx) return null
          const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.0)")
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.5)")
          return gradient
        },
      },
      // Modern color palette for charts
      palette: [
        "rgba(79, 70, 229, 1)", // Indigo
        "rgba(168, 85, 247, 1)", // Purple
        "rgba(236, 72, 153, 1)", // Pink
        "rgba(14, 165, 233, 1)", // Sky
        "rgba(34, 211, 238, 1)", // Cyan
        "rgba(16, 185, 129, 1)", // Emerald
      ],
    }

    // Common chart options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20,
            font: {
              family: fontFamily,
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: theme === "dark" ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
          titleColor: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(17, 24, 39, 0.9)",
          bodyColor: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(17, 24, 39, 0.7)",
          borderColor: theme === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.8)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          boxPadding: 6,
          titleFont: {
            family: fontFamily,
            size: 13,
            weight: "bold" as const,
          },
          bodyFont: {
            family: fontFamily,
            size: 12,
          },
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            color: textColor,
            font: {
              family: fontFamily,
              size: 11,
            },
            padding: 8,
          },
          border: {
            display: false,
          },
        },
        y: {
          grid: {
            color: gridColor,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            color: textColor,
            font: {
              family: fontFamily,
              size: 11,
            },
            padding: 8,
          },
          border: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 2,
        },
        point: {
          radius: 3,
          hoverRadius: 5,
          borderWidth: 2,
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
        },
        bar: {
          borderRadius: 8,
        },
        arc: {
          borderWidth: 0,
        },
      },
      layout: {
        padding: 10,
      },
    }

    // Status chart (Doughnut)
    if (statusChartRef.current) {
      const completed = tasks.filter((t) => t.completed).length
      const pending = tasks.length - completed

      if (statusChartInstance.current) {
        statusChartInstance.current.destroy()
      }

      statusChartInstance.current = new Chart(statusChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Completed", "Pending"],
          datasets: [
            {
              data: [completed, pending],
              backgroundColor: [
                chartColors.primary.stroke,
                theme === "dark" ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.8)",
              ],
              borderColor: [
                chartColors.primary.stroke,
                theme === "dark" ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.8)",
              ],
              borderWidth: 0,
              hoverOffset: 5,
            },
          ],
        },
        options: {
          ...commonOptions,
          cutout: "75%",
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                  const percentage = Math.round(((value as number) / total) * 100)
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
        },
      })
    }

    // Priority chart (Bar)
    if (priorityChartRef.current) {
      const highPriority = tasks.filter((t) => t.priority === "High").length
      const mediumPriority = tasks.filter((t) => t.priority === "Medium").length
      const lowPriority = tasks.filter((t) => t.priority === "Low").length

      if (priorityChartInstance.current) {
        priorityChartInstance.current.destroy()
      }

      priorityChartInstance.current = new Chart(priorityChartRef.current, {
        type: "bar",
        data: {
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              label: "Tasks",
              data: [highPriority, mediumPriority, lowPriority],
              backgroundColor: [
                "rgba(236, 72, 153, 0.8)", // Pink for high
                "rgba(234, 179, 8, 0.8)", // Yellow for medium
                "rgba(16, 185, 129, 0.8)", // Emerald for low
              ],
              borderWidth: 0,
              borderRadius: 8,
              barPercentage: 0.6,
              categoryPercentage: 0.7,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: false,
            },
          },
          scales: {
            ...commonOptions.scales,
            y: {
              ...commonOptions.scales.y,
              beginAtZero: true,
              ticks: {
                ...commonOptions.scales.y.ticks,
                precision: 0,
              },
            },
          },
        },
      })
    }

    // Timeline chart (Line)
    if (timelineChartRef.current) {
      // Get date labels for the last 7 days
      const dateLabels = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dateLabels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }

      // Simulate completed tasks over time
      const timelineData = [1, 2, 3, 4, 3, 5, 4]

      if (timelineChartInstance.current) {
        timelineChartInstance.current.destroy()
      }

      timelineChartInstance.current = new Chart(timelineChartRef.current, {
        type: "line",
        data: {
          labels: dateLabels,
          datasets: [
            {
              label: "Completed Tasks",
              data: timelineData,
              borderColor: chartColors.primary.stroke,
              backgroundColor: (context) => {
                const chart = context.chart
                const { ctx, chartArea } = chart
                if (!chartArea) return null
                return chartColors.primary.gradient(ctx, chartArea)
              },
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: chartColors.primary.stroke,
              pointBorderColor: theme === "dark" ? "#1f2937" : "#ffffff",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: false,
            },
          },
          scales: {
            ...commonOptions.scales,
            y: {
              ...commonOptions.scales.y,
              beginAtZero: true,
              ticks: {
                ...commonOptions.scales.y.ticks,
                precision: 0,
              },
            },
          },
        },
      })
    }

    // Category chart (Polar Area)
    if (categoryChartRef.current) {
      const development = tasks.filter((t) => t.category === "Development").length
      const design = tasks.filter((t) => t.category === "Design").length
      const marketing = tasks.filter((t) => t.category === "Marketing").length
      const research = tasks.filter((t) => t.category === "Research").length
      const business = tasks.filter((t) => t.category === "Business").length
      const operations = tasks.filter((t) => t.category === "Operations").length

      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy()
      }

      categoryChartInstance.current = new Chart(categoryChartRef.current, {
        type: "polarArea",
        data: {
          labels: ["Development", "Design", "Marketing", "Research", "Business", "Operations"],
          datasets: [
            {
              data: [development, design, marketing, research, business, operations],
              backgroundColor: chartColors.palette.map((color) => color.replace("1)", "0.7)")),
              borderWidth: 0,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            r: {
              ticks: {
                display: false,
              },
              grid: {
                color: gridColor,
              },
              angleLines: {
                color: gridColor,
              },
            },
          },
        },
      })
    }

    // Time Spent Chart (Horizontal Bar)
    if (timeSpentChartRef.current) {
      // Get top 5 tasks by time spent
      const tasksByTime = [...tasks]
        .filter((t) => t.timer > 0)
        .sort((a, b) => b.timer - a.timer)
        .slice(0, 5)

      if (timeSpentChartInstance.current) {
        timeSpentChartInstance.current.destroy()
      }

      timeSpentChartInstance.current = new Chart(timeSpentChartRef.current, {
        type: "bar",
        data: {
          labels: tasksByTime.map((t) => (t.title.length > 20 ? t.title.substring(0, 20) + "..." : t.title)),
          datasets: [
            {
              label: "Time Spent (hours)",
              data: tasksByTime.map((t) => Math.round((t.timer / 3600000) * 100) / 100), // Convert ms to hours
              backgroundColor: (context) => {
                const chart = context.chart
                const { ctx, chartArea } = chart
                if (!chartArea) return chartColors.primary.stroke

                const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0)
                gradient.addColorStop(0, chartColors.primary.stroke)
                gradient.addColorStop(1, chartColors.secondary.stroke)
                return gradient
              },
              borderWidth: 0,
              borderRadius: 8,
              barPercentage: 0.7,
              categoryPercentage: 0.8,
            },
          ],
        },
        options: {
          ...commonOptions,
          indexAxis: "y",
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: false,
            },
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: (context) => {
                  const value = context.raw as number
                  return `Time spent: ${value.toFixed(2)} hours (${formatTime(tasksByTime[context.dataIndex].timer)})`
                },
              },
            },
          },
        },
      })
    }

    // Productivity Gauge Chart
    if (productivityGaugeRef.current) {
      // Calculate productivity score
      const totalTasks = tasks.length
      const completedTasks = tasks.filter((t) => t.completed).length
      const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      if (productivityGaugeInstance.current) {
        productivityGaugeInstance.current.destroy()
      }

      // Get color based on score
      let gaugeColor = "rgba(236, 72, 153, 1)" // Pink (low)
      if (productivityScore >= 70) {
        gaugeColor = "rgba(16, 185, 129, 1)" // Emerald (high)
      } else if (productivityScore >= 30) {
        gaugeColor = "rgba(234, 179, 8, 1)" // Yellow (medium)
      }

      productivityGaugeInstance.current = new Chart(productivityGaugeRef.current, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [productivityScore, 100 - productivityScore],
              backgroundColor: [gaugeColor, theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"],
              borderWidth: 0,
              circumference: 180,
              rotation: 270,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "75%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        },
        plugins: [
          {
            id: "gaugeText",
            afterDraw: (chart) => {
              const {
                ctx,
                chartArea: { width, height },
              } = chart

              ctx.save()

              // Draw score text
              const scoreText = `${productivityScore}%`
              ctx.font = `bold 24px ${fontFamily}`
              ctx.fillStyle = textColor
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText(scoreText, width / 2, height - 10)

              // Draw label text
              const labelText = "Productivity"
              ctx.font = `14px ${fontFamily}`
              ctx.fillStyle = textColor
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText(labelText, width / 2, height + 20)

              ctx.restore()
            },
          },
        ],
      })
    }

    // Cleanup on unmount
    return () => {
      ;[
        statusChartInstance,
        priorityChartInstance,
        timelineChartInstance,
        categoryChartInstance,
        timeSpentChartInstance,
        productivityGaugeInstance,
      ].forEach((instance) => {
        if (instance.current) {
          instance.current.destroy()
          instance.current = null
        }
      })
    }
  }, [tasks, view, theme])

  if (view !== "graph") return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        <Activity className="h-6 w-6 text-primary" />
        Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Task Status</h3>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={statusChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Priority Distribution</h3>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={priorityChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Completion Timeline</h3>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={timelineChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Category Distribution</h3>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Time Spent on Tasks</h3>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={timeSpentChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Productivity Score</h3>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <canvas ref={productivityGaugeRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
