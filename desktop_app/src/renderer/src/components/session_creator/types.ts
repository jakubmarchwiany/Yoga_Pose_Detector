export type CameraParameters = { label: string; deviceId: string }

export type Pose = {
  name: string
  value: number
}

export const AVAILABLE_POSES: Pose[] = [
  { name: 'Chair', value: 0 },
  { name: 'Cobra', value: 1 },
  { name: 'Dog', value: 2 },
  { name: 'Shoulderstand', value: 4 },
  { name: 'Traingle', value: 5 },
  { name: 'Tree', value: 6 },
  { name: 'Warrior', value: 7 }
]
