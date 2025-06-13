// pages/api/validate.ts

import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { guess } = req.body

  const characterOfTheDay = {
    name: 'Zhao Yun',
    gender: 'male',
    faction: 'Shu',
    weapon: 'Spear',
  }

  const characterDetails = {
    'Zhao Yun': { gender: 'male', faction: 'Shu', weapon: 'Spear' },
    'Lu Bu': { gender: 'male', faction: 'None', weapon: 'Halberd' },
    'Diao Chan': { gender: 'female', faction: 'None', weapon: 'Whip' },
  }

  const guessed = characterDetails[guess]
  if (!guessed) return res.status(404).json({ error: 'Character not found' })

  const hints = {
    name: guess === characterOfTheDay.name,
    gender: guessed.gender === characterOfTheDay.gender,
    faction: guessed.faction === characterOfTheDay.faction,
    weapon: guessed.weapon === characterOfTheDay.weapon,
  }

  res.status(200).json({ hints })
}
