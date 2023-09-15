import { useMemo, useState } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { getWeekDays } from '../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import dayjs from 'dayjs'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const shortWeekDays = getWeekDays({ short: true })

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    })
      .map((_, i) => {
        return currentDate.set('date', i + 1)
      })
      .map((date) => {
        return { date, disabled: date.endOf('day').isBefore(new Date()) }
      })

    const firstMonthWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstMonthWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()
      .map((date) => {
        return { date, disabled: true }
      })

    const lastMonthWeekDay = currentDate.set('date', currentDate.daysInMonth())

    const lastWeekDay = lastMonthWeekDay.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    })
      .map((_, i) => {
        return lastMonthWeekDay.add(i + 1, 'day')
      })
      .map((date) => {
        return { date, disabled: true }
      })

    const calendarDays = [
      ...previousMonthFillArray,
      ...daysInMonthArray,
      ...nextMonthFillArray,
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate])

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonth)
  }

  function handleNextMonth() {
    const previousMonth = currentDate.add(1, 'month')

    setCurrentDate(previousMonth)
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth}>
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <CalendarDay
                    onClick={() => onDateSelected(date.toDate())}
                    disabled={disabled}
                  >
                    {date.get('date')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
