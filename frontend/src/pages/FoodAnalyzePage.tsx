import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPost } from '@/lib/api'
import { useTodaysLogs } from '@/hooks/useFoodLog'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Camera, Upload, Check, AlertTriangle } from 'lucide-react'

interface DetectedItem {
  name: string
  name_tamil?: string
  estimated_portion_grams: number
  confidence: number
  matched_food?: { id: string; name: string; name_tamil?: string }
  nutrition?: { calories: number; protein: number; carbs: number; fat: number }
  db_alternatives?: { id: string; name: string }[]
}

interface AnalysisResult {
  items: DetectedItem[]
  overall_confidence: number
  notes: string
  error?: string
}

export function FoodAnalyzePage() {
  const navigate = useNavigate()
  const { logFood } = useTodaysLogs()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [logging, setLogging] = useState(false)

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)
      setImageBase64(dataUrl.split(',')[1])
      setResult(null)
    }
    reader.readAsDataURL(file)
  }, [])

  async function analyzeImage() {
    if (!imageBase64) return
    setAnalyzing(true)
    try {
      const res = await apiPost<AnalysisResult>('/api/food/analyze', { image_base64: imageBase64 })
      setResult(res)
    } catch {
      setResult({ items: [], overall_confidence: 0, notes: 'Analysis failed. Make sure the backend is running with a valid Google AI API key.', error: 'failed' })
    } finally {
      setAnalyzing(false)
    }
  }

  async function logDetectedItems() {
    if (!result) return
    setLogging(true)
    try {
      for (const item of result.items) {
        if (item.matched_food) {
          await logFood('lunch', item.matched_food.id, item.estimated_portion_grams)
        }
      }
      navigate('/dashboard')
    } catch {
      // ignore
    } finally {
      setLogging(false)
    }
  }

  const confidenceColor = (c: number) =>
    c >= 0.8 ? 'text-success' : c >= 0.5 ? 'text-warning' : 'text-danger'

  return (
    <div className="py-6 max-w-xl mx-auto">
      <h1 className="text-xl font-heading font-bold mb-1">Food Image Analysis</h1>
      <p className="text-sm text-text-secondary mb-6">Upload a photo of your food and AI will identify the items and calculate nutrition.</p>

      {!imagePreview ? (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            <Camera size={40} className="text-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">Upload a food photo</p>
            <p className="text-xs text-text-muted">Click or drag a photo here</p>
          </div>
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border">
            <img src={imagePreview} alt="Food" className="w-full max-h-64 object-cover" />
            <button
              onClick={() => { setImagePreview(null); setImageBase64(null); setResult(null) }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {!result && (
            <Button onClick={analyzeImage} loading={analyzing} className="w-full">
              <Upload size={16} /> Analyze food
            </Button>
          )}

          {result && (
            <div className="space-y-3">
              {result.error ? (
                <Card padding="md" className="bg-red-50 border-danger/20">
                  <div className="flex items-center gap-2 text-danger">
                    <AlertTriangle size={18} />
                    <p className="text-sm">{result.notes}</p>
                  </div>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Detected items</h3>
                    <span className={`text-xs font-heading font-bold ${confidenceColor(result.overall_confidence)}`}>
                      {Math.round(result.overall_confidence * 100)}% confidence
                    </span>
                  </div>

                  {result.items.map((item, i) => (
                    <Card key={i} padding="sm" className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center text-xl">🍛</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        {item.name_tamil && <p className="font-tamil text-xs text-text-muted">{item.name_tamil}</p>}
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <span>~{item.estimated_portion_grams}g</span>
                          {item.nutrition && (
                            <>
                              <span>·</span>
                              <span>{item.nutrition.calories} kcal</span>
                              <span>·</span>
                              <span className="text-protein">{item.nutrition.protein}g protein</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${confidenceColor(item.confidence)}`}>
                        {Math.round(item.confidence * 100)}%
                      </span>
                      {item.matched_food ? (
                        <Badge variant="vegan">Matched</Badge>
                      ) : (
                        <Badge variant="warning">No match</Badge>
                      )}
                    </Card>
                  ))}

                  {result.notes && (
                    <p className="text-xs text-text-muted italic">{result.notes}</p>
                  )}

                  {result.items.some(i => i.matched_food) && (
                    <Button onClick={logDetectedItems} loading={logging} className="w-full">
                      <Check size={16} /> Log detected items
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
