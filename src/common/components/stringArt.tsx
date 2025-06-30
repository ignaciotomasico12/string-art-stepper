"use client"

import { useState, useMemo } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiRefreshCw, FiRotateCw } from "react-icons/fi";
import { points } from "../data/points"

export default function StringArt() {
    const localStorageKey = "stringArtCurrentStep"
    const savedStep = typeof window !== "undefined" ? localStorage.getItem(localStorageKey) : null

    const [currentStep, setCurrentStep] = useState<number>(savedStep ? parseInt(savedStep) : 0)
    const [rotation, setRotation] = useState(0)

    const steps = useMemo(() => {
        const arr: { from: number; to: number }[] = []
        for (let i = 0; i < points.length - 1; i++) {
            arr.push({ from: points[i], to: points[i + 1] })
        }
        return arr
    }, [])

    const totalSteps = steps.length
    const currentStepData = steps[currentStep] ?? { from: points[0], to: points[1] }

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, String(Math.min(currentStep + 1, totalSteps - 1)))
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, String(Math.max(currentStep - 1, 0)))
        }
    }

    const resetSteps = () => {
        setCurrentStep(0)
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, "0")
        }
    }

    const jumpToStep = (step: number) => {
        setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, String(Math.max(0, Math.min(step, totalSteps - 1))))
        }
    }

    const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0

    const circlePoints = useMemo(() => {
        const radius = 360
        const centerX = 400
        const centerY = 400
        const points = []

        for (let i = 1; i <= 300; i++) {
            const angle = -((i - 1) / 300) * 2 * Math.PI
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            points.push({ number: i, x, y })
        }

        return points
    }, [])

    const linesToDraw = useMemo(() => {
        const lines = []
        for (let i = 0; i <= Math.min(currentStep, steps.length - 1); i++) {
            const step = steps[i]
            const fromPoint = circlePoints.find((p) => p.number === step.from)
            const toPoint = circlePoints.find((p) => p.number === step.to)

            if (fromPoint && toPoint) {
                lines.push({
                    x1: fromPoint.x,
                    y1: fromPoint.y,
                    x2: toPoint.x,
                    y2: toPoint.y,
                })
            }
        }
        return lines
    }, [currentStep, steps, circlePoints])

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Guía de String Art</h1>
            </div>
        
            <div className="bg-white rounded-xl shadow-lg p-4 text-center relative">
                <button
                    title="Reiniciar pasos"
                    onClick={resetSteps}
                    className="absolute right-4 flex justify-center items-center p-2 aspect-square bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FiRefreshCw  />
                </button>
                <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Paso Actual</span>
                    <div className="w-full flex justify-between items-center mt-2 mb-4">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
                        >
                            <FiChevronLeft />
                            Anterior
                        </button>
                        <div className="text-6xl font-bold text-gray-800 my-4">
                            {currentStep + 1} / {totalSteps}
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={currentStep === totalSteps - 1}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
                        >
                            Siguiente
                            <FiChevronRight />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-8 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-blue-500 font-bold text-sm">De</span>
                        </div>
                        <span className="text-4xl font-bold text-blue-600">{currentStepData.from}</span>
                    </div>
                    <div className="text-3xl text-gray-400"><FiArrowRight /></div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-green-500 font-bold text-sm">A</span>
                        </div>
                        <span className="text-4xl font-bold text-green-600">{currentStepData.to}</span>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                    <button
                        onClick={() => jumpToStep(0)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        Inicio
                    </button>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => jumpToStep(Math.floor(totalSteps * 0.25))}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            25%
                        </button>
                        <button
                            onClick={() => jumpToStep(Math.floor(totalSteps * 0.5))}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            50%
                        </button>
                        <button
                            onClick={() => jumpToStep(Math.floor(totalSteps * 0.75))}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            75%
                        </button>
                    </div>
                    <button
                        onClick={() => jumpToStep(totalSteps - 1)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        Final
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 relative">
                <div className="flex justify-center items-center w-full">
                    <span className="text-sm py-2 font-medium text-gray-500 uppercase tracking-wide">Vista Previa</span>
                    <button
                        onClick={() => setRotation((prev) => prev + 90)}
                        className="absolute right-4 top-4 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
                    >
                        Rotar
                        <FiRotateCw  />
                    </button>
                </div>
                <div className={`flex justify-center`}>
                    <div className="bg-white">
                        <svg suppressHydrationWarning width="800" height="800" viewBox="0 0 800 800">
                            <g transform={`rotate(${rotation} 400 400)`}>
                                {linesToDraw.map((line, index) => (
                                    <line
                                        key={index}
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="#000000"
                                        strokeWidth="0.3"
                                    />
                                ))}
                                {circlePoints.map((point) => (
                                    <g key={point.number}>
                                        <circle cx={point.x} cy={point.y} r="2" fill="black" stroke="none" strokeWidth="0" />
                                        {point.number % 10 === 0 && (
                                            <text x={point.x} y={point.y - 8} textAnchor="middle" fontSize="8" fill="black">
                                                {point.number}
                                            </text>
                                        )}
                                    </g>
                                ))}
                                {currentStepData && (
                                    <>
                                        {(() => {
                                            const fromPoint = circlePoints.find((p) => p.number === currentStepData.from)
                                            return fromPoint ? (
                                                <circle cx={fromPoint.x} cy={fromPoint.y} r="4" fill="purple" />
                                            ) : null
                                        })()}

                                        {(() => {
                                            const toPoint = circlePoints.find((p) => p.number === currentStepData.to)
                                            return toPoint ? (
                                                <circle cx={toPoint.x} cy={toPoint.y} r="4" fill="purple" />
                                            ) : null
                                        })()}

                                        {(() => {
                                            const fromPoint = circlePoints.find((p) => p.number === currentStepData.from)
                                            const toPoint = circlePoints.find((p) => p.number === currentStepData.to)
                                            return fromPoint && toPoint ? (
                                                <line
                                                    x1={fromPoint.x}
                                                    y1={fromPoint.y}
                                                    x2={toPoint.x}
                                                    y2={toPoint.y}
                                                    stroke="purple"
                                                />
                                            ) : null
                                        })()}
                                    </>
                                )}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
