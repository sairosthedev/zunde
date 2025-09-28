export interface Participant {
  _id?: string
  fullName: string
  contactNumber: string
  email: string
  churchAssembly: string
  preferredDepartureLocation: string
  emergencyContact: string
  emergencyContactNumber: string
  eventId: string
  ticketId: string
  registrationDate: Date
  status: "registered" | "checked-in" | "checked-out" | "no-show"
  busNumber?: string
  qrCode?: string
}

export interface Event {
  _id?: string
  name: string
  date: Date
  description: string
  departureLocations: string[]
  maxParticipants: number
  registrationDeadline: Date
  status: "upcoming" | "registration-open" | "registration-closed" | "completed"
  createdAt: Date
}

export interface CheckInRecord {
  _id?: string
  participantId: string
  eventId: string
  checkInTime: Date
  checkOutTime?: Date
  busNumber: string
  staffMember: string
  location: string
}
