import { useEffect, useState } from "react"
import { LOADING_ACTIVITY_MESSAGES } from "../../lib/constants"
import "./LensActivityFeed.css"

interface ActivityItem {
  id: number
  message: string
}

export function LensActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([])

  useEffect(() => {
    let nextId = 0
    let lastIndex = -1

    const addItem = () => {
      // Pick a different message than last time
      let index = Math.floor(Math.random() * LOADING_ACTIVITY_MESSAGES.length)
      if (index === lastIndex) {
        index = (index + 1) % LOADING_ACTIVITY_MESSAGES.length
      }
      lastIndex = index

      const newItem = { id: nextId++, message: LOADING_ACTIVITY_MESSAGES[index] }

      setItems((prev) => {
        const updated = [...prev, newItem]
        return updated.length > 3 ? updated.slice(-3) : updated
      })
    }

    const initialTimer = setTimeout(addItem, 1200)
    const intervalTimer = setInterval(addItem, 3800)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    }
  }, [])

  return (
    <div className="activity-feed">
      {items.map((item) => (
        <div key={item.id} className="activity-item">
          {item.message}
        </div>
      ))}
    </div>
  )
}
