import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n').reduce((acc, row) => {
  const [cards, bid] = row.split(' ')
  acc.push({cards, bid: parseInt(bid)})
  return acc
}, [])

const CARDS = "23456789TJQKA"
const CARDS_WITH_JOKER = "J23456789TQKA"

const getHandScore = (part) => (hand) => {
  const cards = hand.split('')
  const cardCounts = cards.reduce((acc, card) => {
    acc[card] = acc[card] ? acc[card] + 1 : 1
    return acc
  }, {})
  const counts = Object.values(cardCounts)
  const lenghts = Object.keys(cardCounts).length
  const jokers = cardCounts['J'] || 0
  if (part === 2 && jokers > 0) {
    const mostCommonCard = Object.keys(cardCounts).reduce((a, b) => {
      if (a === 'J') {
        return b
      } else if (b === 'J') {
        return a
      }
      return cardCounts[a] > cardCounts[b] ? a : b
    })
    return getHandScore(1)(hand.replace(/J/g, mostCommonCard))
  }
  if (counts.includes(5)) {
      return 8
  } else if (counts.includes(4)) {
    return 7
  } else if (counts.includes(3) && counts.includes(2)) {
    return 6
  } else if (counts.includes(3)) {
    return 3
  } else if (counts.includes(2) && lenghts === 3) {
    return 2
  } else if (counts.includes(2)) {
    return 1
  } else {
    return 0
  }
}

const handsSort = (part) => (a, b) => {
    const pack = part === 1 ? CARDS : CARDS_WITH_JOKER
    const aScore = getHandScore(part)(a)
    const bScore = getHandScore(part)(b)
    if (aScore === bScore) {
        for (let i = 0; i < a.length; i++) {
            if (pack.indexOf(a[i]) > pack.indexOf(b[i])) {
                return -1
            } else if (pack.indexOf(a[i]) < pack.indexOf(b[i])) {
                return 1
            }
        }
    }
    return bScore - aScore
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const sorted = input.sort((a, b) => handsSort(1)(a.cards, b.cards)).reverse()
  return sorted.map((h, i) => h.bid*(i+1)).reduce((a, b) => a + b, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const sorted = input.sort((a, b) => handsSort(2)(a.cards, b.cards)).reverse()
  return sorted.map((h, i) => h.bid*(i+1)).reduce((a, b) => a + b, 0)
}

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
      {
        input: `33322 1
22243 2`,
        expected: 4,
      },
      {
        input: `99JTT 1
QQJJQ 2`,
        expected: 5,
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
