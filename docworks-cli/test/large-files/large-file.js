/**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BookRequest
 * @property {wix-bookings-backend~FormInfo} formInfo Form filled information. Mandatory. contains contact details, participants, other form fields specified by the owner for the chosen service.
 Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~BookingSource} bookingSource Identifies the source (platform, actor and app) that created this booking

 This property of the Booking can not be changed. It will be published in the BookingNotification callback for
 every update of this Booking.

 The app_def_id and app_name will be resolved automatically and should not be provided
 * @property {Boolean} sendSmsReminder When value is set to True, an SMS reminder would be sent to the phone number specified in the ContactDetails, 24 hours before the session starts.
 * @property {String} couponCode Coupon code to apply for this booking
 * @property {Boolean} notifyParticipants
 * @property {wix-bookings-backend~PaidPlan} planSelection Describes the selected paid plan to use for this booking.
 * @property {String} externalUserId A user identifier of an external application user that initiated the book request.
 Allows an external application to later identify its own bookings and correlate to its own internal users
 * @property {wix-bookings-backend~schedule} schedule The selected schedule to book.
 Can be a specific session, or pre-defined schedule.
 */

/**
 * @typedef wix-bookings-backend~BookResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~schedule
 * @summary The selected schedule to book.
 Can be a specific session, or pre-defined schedule.
 * @property {wix-bookings-backend~Session} createSession
 * @property {wix-bookings-backend~BySessionId} bySessionId
 * @property {String} scheduleId
 * @property {String} sessionId
 */

/**
 * @function book
 * @summary Book a service.
 This method has 2 modes of operation:
 1. Book by a customer.
 2. Book by the business (e.g. the business owner) on behalf of a customer.

 When the booking is done by the customer, the following takes place:
 - Validation of the booking details according to the bookings policy and the service form mandatory fields.
 - Payment rules are applied. It can be creating a new order in Wix Payments, or redeeming the given paid plan.
   When online payment is required, the response contains the details of which the user of this api can complete the payment using Wix Payment Service.
 - When booking an approval required service, The booking is not charged until it is confirmed by the business.
   - BySessionId: The participant added to session is marked as PENDING until the booking is confirmed by the business.
   - Slot: A new session is created with affected availability based on the configuration defined in the service policy.

 > **Permissions**
 > This endpoint requires the Read Bookings - Public data or the Manage Bookings permission scope.
 > With the Read Bookings - Public data permission scope, a customer booking flow is applied.
 > With the Manage Bookings permission scope, a business 'book on behalf' flow is applied.
 * @param {wix-bookings-backend~BookRequest} bookRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BookResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CancelBookingResponse
 * @property {String} id Id of the Booking to be cancelled
 * @property {Array<wix-bookings-backend~Error>} errors
 */

/**
 * @typedef wix-bookings-backend~Error
 * @property {String} message
 * @property {String} code
 */

/**
 * @typedef wix-bookings-backend~CancelBookingRequest
 * @property {String} id Id of the Booking to be cancelled
 * @property {Boolean} notifyParticipants Indication whether to notify the participants in this Booking that it's cancelled (e.g. in email)
 deprecated, use participant_notification
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 */

/**
 * @function cancel
 * @summary Cancel an existing booking.
 When invoked by a customer flow, this action is validated against the service's bookings policy.
 Cancelling a bookings triggers the following:
 - The corresponding participant is removed from the session.
 - If the booking was created from a slot (and not session id or schedule id), the corresponding session is deleted from the calendar.
 - The booking status changes CANCELED.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~CancelBookingRequest} cancelBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CancelBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CheckoutBookingResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~CheckoutBookingRequest
 * @property {String} lockedSessionKey optional. The locked session key.
 * @property {String} couponCode optional. Coupon code to use. (cannot be used with a paid plan)
 * @property {String} bookingId The booking identifier to pay.
 * @property {Boolean} notifyParticipants A field We pass forward when publishing a booking notification
 * @property {wix-bookings-backend~PaidPlan} planSelection Paid plan to use.
 */

/**
 * @function checkout
 * @summary Checkout a booking.
 When invoking this method the following takes place:
 - The availability of the requested slot/session/schedule is validated.
 - The Booking is charged, by creating a new order in Wix Payment Service, or by redeem the given paid plan.
 - (Can happen asynchronously) On payment complete and according to the request and the current booking's state,
   A new session is created in the calendar, Or a participant is added to the selected session/schedule.
 Note: In case the requested booked session is locked, the session key will be needed in order to Checkout the booking.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~CheckoutBookingRequest} checkoutBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CheckoutBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function confirm
 * @summary Confirm a booking request.
 When invoking this API the following takes place:
 - The participant status on the session changes to APPROVED.
 - Slot availability is updated.
 - The Booking status changes to CONFIRMED.
 - The Booking is charged creating an offline-order in Wix Payment Service.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~ConfirmBookingRequest} confirmBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ConfirmBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateBookingResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~CreateBookingRequest
 * @property {wix-bookings-backend~FormInfo} formInfo Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~BookingSource} bookingSource Identifies the source (platform, actor and app) that created this booking

 This property of the Booking can not be changed. It will be published in the BookingNotification callback for
 every update of this Booking.

 The app_def_id and app_name will be resolved automatically and should not be provided
 * @property {wix-bookings-backend~schedule} schedule The selected schedule to book.
 Can be a specific session, or pre-defined schedule.
 */

/**
 * @typedef wix-bookings-backend~schedule
 * @summary The selected schedule to book.
 Can be a specific session, or pre-defined schedule.
 * @property {wix-bookings-backend~Session} createSession Session to create and book.
 * @property {wix-bookings-backend~BySessionId} bySessionId Session Id to book.
 * @property {String} scheduleId Schedule Id to book.
 * @property {String} sessionId
 */

/**
 * @function createBooking
 * @summary Create a new PENDING booking.
 When invoking this API the following flow happens internally:
  1. We create a new Booking in PENDING state.
  2. We asynchronously create a new Contact if needed.
 - We do not charge it.
 - We do not publish any event.
 In order to complete this booking - create a new session, or add a participant to a session or a schedule on the Calendar
 it has to be successfully checked-out; It is possible by invoking the Checkout API.
 * @param {wix-bookings-backend~CreateBookingRequest} createBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function decline
 * @summary Decline a booking request.
 When invoking this API the following takes place:
 - The participant status on the session changes to DECLINED.
 - The corresponding session or participant is deleted from the calendar.

 - The Booking status changes to DECLINED.
 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~DeclineBookingRequest} declineBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeclineBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~GetRequest
 * @property {String} id
 * @property {Boolean} withBookingAllowedActions If true will return the allowed actions for the booking calculated using the business booking policy.
 */

/**
 * @typedef wix-bookings-backend~GetResponse
 * @property {wix-bookings-backend~ListBookingEntry} bookingEntry
 */

/**
 * @function get
 * @summary Returns a Booking.

> **Permissions**
> The API requires BOOKINGS.READ_BOOKINGS permissions
 * @param {wix-bookings-backend~GetRequest} getRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~Slot
 * @summary Based on calendar and is eventually consistent, check if a session in the specified time of the schedule
 with the specified scheduleId is available, and make sure that also the required schedules are available
 for the specified time
 * @property {String} scheduleId the ID of the schedule to which the slot belongs
 * @property {Date} start the start time of the slot
 * @property {Date} end the end time of the slot
 * @property {Array<String>} requiredScheduleIds ids of other schedules that are required as well
 */

/**
 * @typedef wix-bookings-backend~GetAvailabilityResponse
 * @property {Boolean} available whether or not the requested entity is available for booking of the specified party size
 * @property {Number} capacity The maximum number of participants that can be added to the session. Optional.
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session
 */

/**
 * @typedef wix-bookings-backend~AvailabilityFor
 * @property {String} bookingId If the booking is already confirmed, returns available will be true.
 Otherwise, will check availability according to the schedule type of the booking (create_session, session_id or schedule_id)
 * @property {String} scheduleId Based on schedules, check if schedule with the given ID is available for booking
 * @property {String} sessionId Based on schedules, check if session with the given ID is available for booking
 * @property {wix-bookings-backend~Slot} session Based on calendar and is eventually consistent, check if a session in the specified time of the schedule
 with the specified scheduleId is available, and make sure that also the required schedules are available
 for the specified time
 */

/**
 * @typedef wix-bookings-backend~GetAvailabilityRequest
 * @property {Number} partySize how many spots are required
 * @property {wix-bookings-backend~AvailabilityFor} availabilityFor
 */

/**
 * @function getAvailability
 * @summary Returns the current availability of a requested entity.
 Based on the requested entity, validate there is enough spots left.
 When invoking on a locked session, availability is False.
 * @param {wix-bookings-backend~GetAvailabilityRequest} getAvailabilityRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetAvailabilityResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListBookingsResponse
 * @property {Array<wix-bookings-backend~ListBookingEntry>} bookingsEntries
 * @property {wix-bookings-backend~Paging} paging
 * @property {wix-bookings-backend~QueryMetaData} metadata
 */

/**
 * @typedef wix-bookings-backend~ListBookingsRequest
 * @property {wix-bookings-backend~Query} query
 * @property {Boolean} withBookingAllowedActions If true will return the allowed actions for each booking calculated using the business booking policy.
 */

/**
 * @typedef wix-bookings-backend~QueryMetaData
 * @property {Number} items
 * @property {Number} offset
 * @property {Number} totalCount
 */

/**
 * @function list
 * @param {wix-bookings-backend~ListBookingsRequest} listBookingsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListBookingsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function listByContacts
 * @param {wix-bookings-backend~ListByContactsRequest} listByContactsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListByContactsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~LockRequest
 * @property {String} sessionId
 */

/**
 * @typedef wix-bookings-backend~LockResponse
 * @property {String} key
 */

/**
 * @function lock
 * @summary Lock a session for bookings.
 When invoking this API with a sessionId, it returns a key that will enable to book the given session.
 Once the session is locked -
 - Only the holder of the right key will be able to Book or Checkout.
 - Calling GetAvailability returns as not available.
 - Invoking Bookings.Book, Bookings.Checkout APIs without the right key will fail.
 * @param {wix-bookings-backend~LockRequest} lockRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~LockResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~RescheduleRequest
 * @property {String} bookingId Id of the Booking to be updated
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 * @property {wix-bookings-backend~reschedule} reschedule The new scheduling item to which the booking was rescheduled
 */

/**
 * @typedef wix-bookings-backend~RescheduleResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~reschedule
 * @summary The new scheduling item to which the booking was rescheduled
 * @property {wix-bookings-backend~Session} createSession Reschedule to a new session that. This will create the session.
 * @property {wix-bookings-backend~BySessionId} bySessionId Reschedule to an existing session with start & end dates for validation
 * @property {String} scheduleId Reschedule to an existing schedule
 */

/**
 * @function reschedule
 * @summary Reschedule a Booking.
 When rescheduling a booking of a slot, the session on the calendar is updated as well.
 Note: Rescheduling a booking to a schedule is not supported.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~RescheduleRequest} rescheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~RescheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~SetAttendanceRequest
 * @property {String} bookingId Id of the Booking to be updated
 * @property {wix-bookings-backend~AttendanceInfo} attendanceInfo Attendance information for the booking
 */

/**
 * @typedef wix-bookings-backend~SetAttendanceResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @function setAttendance
 * @summary Set the booking attendance status.
 * @param {wix-bookings-backend~SetAttendanceRequest} setAttendanceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~SetAttendanceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UnLockResponse
 */

/**
 * @typedef wix-bookings-backend~UnLockRequest
 * @property {String} sessionId
 * @property {String} key
 */

/**
 * @function unLock
 * @summary Unlock a locked session for bookings.
 When invoking this API with a sessionId and its key, the session will be available for bookings.
 * @param {wix-bookings-backend~UnLockRequest} unLockRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UnLockResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function update
 * @summary Updates an existing booking details, for the given bookingId.
 When invoking this API the following flow happens internally:
 - On Rescheduling a booking.
   - Based on invoker permission We validate the action against the service's booking policy.
   - When rescheduling a booking to a slot, We also update the created session time on the calendar.
   - When rescheduling a booking to a given session, We remove the participant from the previous session, and add him as a new one to the new requested session.
   - Rescheduling a booking to a schedule is not supported.
   - Finally, We publish OwnerRescheduledBooking or MemberRescheduledBooking based on the invoker permissions.
 - On updating the booking's paid amount received -
   - This action is only allowed to a permitted user.
   - We update the payment in Wix Payment Service and the payment details of the booking.
 - On updating the booking's form info -
   - This action is only allowed to a permitted user.
   - We update the participant details of the session on the calendar.
   - We override the bookings form info with the new given form info.
   - Finally, publish ownerUpdatedBookingFormInfo event.
 - On updating the booking's attendance info -
   - This action is only allowed to a permitted user.
   - We update the booking attendance details and publish ownerUpdatedBookingAttendanceInfo event.
 * @param {wix-bookings-backend~UpdateBookingRequest} updateBookingRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateBookingResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateCustomerInfoResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~UpdateCustomerInfoRequest
 * @property {String} bookingId Id of the Booking to be updated
 * @property {wix-bookings-backend~FormInfo} formInfo Updated form info and contact details
 */

/**
 * @function updateCustomerInfo
 * @summary Update client’s information on a Booking.
 * @param {wix-bookings-backend~UpdateCustomerInfoRequest} updateCustomerInfoRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateCustomerInfoResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function listByContacts
 * @param {wix-bookings-backend~ListByContactsRequest} listByContactsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListByContactsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function enroll
 * @summary Books a site member into the session for which they are waitlisted (waiting resource), and the associated booking is checked out.
 Waitlist registration status is changed to ENROLLED.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~EnrollRequest} enrollRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~EnrollResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~JoinRequest
 * @property {String} waitingResource
 * @property {wix-bookings-backend~FormInfo} formInfo
 * @property {wix-bookings-backend~LocalDateTime} presentedStartTime Session start time as presented to the user. For validation - optional.
 * @property {wix-bookings-backend~LocalDateTime} presentedEndTime Session end time as presented to the user. For validation - optional.
 */

/**
 * @typedef wix-bookings-backend~JoinResponse
 * @property {String} registrationId this is also the booking ID.
 */

/**
 * @function join
 * @summary Registers a site member to a wait-list.
 This API is only available for site-members.
 When invoking this API the following takes place:
 - Validating that the requested session is defined and has a waitlist option.
 - Validating the waitlist has enough capacity.
 - A new Booking is created in PENDING state.
 - A new registration is added to the waitlist.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~JoinRequest} joinRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~JoinResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~LeaveRequest
 * @property {String} registrationId
 * @property {String} waitingResource
 */

/**
 * @typedef wix-bookings-backend~LeaveResponse
 * @property {String} registrationId
 * @property {String} waitingResource
 */

/**
 * @function leave
 * @summary Removes a site member's registration to a waitlist (and cancels the associated pending-state booking).
 If a spot has become available for booking and the server is SUGGESTING registration to waitlist registrants, the next member registered to the waitlist will receive an invitation to the opened spot.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~LeaveRequest} leaveRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~LeaveResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function list
 * @summary Returns a list of waitlisted entries.
 Each WaitingListEntry returned holds the current Waitlist registrations, configuration and suggesting status.
> **Permissions**
> This endpoint requires the Read Bookings - Public Data permissions scope
 * @param {wix-bookings-backend~ListWaitingListRequest} listWaitingListRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListWaitingListResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function register
 * @summary Registers a site member to a waitlist.
 If the requested session does not have a waitlist, or if the waitlist is already full, an error is received.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~RegisterRequest} registerRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~RegisterResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~Slot
 * @summary Check if a time slot is available in a specified schedule.
 * @property {String} scheduleId the ID of the schedule to which the slot belongs to.
 * @property {Date} start Slot's start time.
 * @property {Date} end Slot's end time.
 * @property {Array<String>} requiredScheduleIds The affected schedules on which the availability will be checked. It is enough to have it available on one of the schedules from this list.
 */

/**
 * @typedef wix-bookings-backend~IsAvailableResponse
 * @property {Boolean} available whether or not the requested entity is available for booking of the specified party size
 * @property {Number} capacity The maximum number of participants that can be added to the session.
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session
 */

/**
 * @typedef wix-bookings-backend~AvailabilityFor
 * @property {String} sessionId Check if session with the given ID is available for booking
 * @property {String} scheduleId Check if schedule with the given ID is available for booking
 * @property {wix-bookings-backend~Slot} session Check if a time slot is available in a specified schedule.
 */

/**
 * @typedef wix-bookings-backend~IsAvailableRequest
 * @property {Number} partySize Number of spots to query availability for.
 * @property {wix-bookings-backend~AvailabilityFor} availabilityFor
 */

/**
 * @function isAvailable
 * @summary Returns the current availability of a requested entity.
 Based on the requested entity, validate there is enough spots left.
 When invoking on a locked session, availability is False.

 > **Permissions**
 > This endpoint requires the Read Bookings - Public Data permission scope.
 * @param {wix-bookings-backend~IsAvailableRequest} isAvailableRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~IsAvailableResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~LockRequest
 * @property {String} sessionId session ID to lock
 */

/**
 * @typedef wix-bookings-backend~LockResponse
 * @property {String} key locked session key
 */

/**
 * @function lock
 * @summary Lock a session for bookings.
 When invoking this API with a sessionId, it returns a key that will enable to book the given session.
 Once the session is locked -
 Only the holder of the right key will be able to Book or Checkout.
 Calling IsAvailable returns as not available.
 Invoking Bookings.Book, Bookings.Checkout APIs without the right key will fail.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~LockRequest} lockRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~LockResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UnlockResponse
 */

/**
 * @typedef wix-bookings-backend~UnlockRequest
 * @property {String} sessionId locked session ID to unlock
 * @property {String} key locked session key
 */

/**
 * @function unlock
 * @summary Unlock a locked session for bookings.
 When invoking this API with a sessionId and its key, the session will be available for bookings.

 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~UnlockRequest} unlockRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UnlockResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListAvailableSlotsRequest
 * @property {wix-bookings-backend~Query} query
 * @property {String} pageToken Token for the next page of results
 */

/**
 * @typedef wix-bookings-backend~ListAvailableSlotsResponse
 * @property {Array<wix-bookings-backend~Session>} slots The sessions on the calendar.
 * @property {String} nextPageToken Token for the next page of results
 */

/**
 * @function listAvailableSlots
 * @summary Returns the schedule's available slots, calculated by the schedule's availability specification.
 * @param {wix-bookings-backend~ListAvailableSlotsRequest} listAvailableSlotsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListAvailableSlotsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListSessionsRequest
 * @property {wix-bookings-backend~Query} query Partially supported. See description above.
 * @property {String} pageToken
 */

/**
 * @typedef wix-bookings-backend~ListSessionsResponse
 * @property {Array<wix-bookings-backend~Session>} sessions Sessions on the calendar.
 * @property {String} nextPageToken Sessions paging response.
Token for the next page of results
 */

/**
 * @function listSessions
 * @summary Returns sessions from the business calendar.
Query object support:
- **filter**: supports
  - `scheduleId`: Optional.
  - `from`: query range start time. Required.
  - `to`: query range end time. Required.
  - `tags`: filter by list of tags
  - `scheduleOwnerIds`: the response will contain sessions with the given scheduleOwnerIds and sessions with affectedSchedules with the given scheduleOwnerIds.
  - `transparency`: when applied, the `scheduleOwnerIds` filter is required. In case the transparency = BUSY, the response will contain sessions with the given scheduleOwnerIds and sessions with affectedSchedules with the given scheduleOwnerIds where the owner's transparency is BUSY.
    When transparency = FREE, the response will contain only sessions and affectedSchedules with the given scheduleOwnerIds when the owner's transparency is FREE.
- **fields**: supported.
- **paging**: Paging is supported using the page token. For paging the results, i.e. with a page size of 10, set the `query.paging.limit` to a value of `10`.
    The response will contain a value in the `nextPageToken` field. Pass this value in the `pageToken` field in the following calls and leave the `query` field empty.
- **fieldsets**: not supported.

**Query filter example:**
```
{
  "$and": [{
      "scheduleId": "66a2674c-9267-4600-826e-f463957b9446" },
      { "from": "2019-02-17T13:08:43.000Z" },
      { "to": "2019-02-17T14:08:43.000Z" },
      { "tags": ["GROUP"]},
      { "scheduleOwnerIds: ["66a2674c-9267-4600-826e-f463957b9446", "66a2674c-9267-4600-826e-f463957b9447"]}
]}
```

> **Permissions**
> The API requires CALENDAR.READ_SCHEDULES_SESSIONS
 * @param {wix-bookings-backend~ListSessionsRequest} listSessionsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListSessionsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListSlotsRequest
 * @property {wix-bookings-backend~Query} query Partially supported. See description above.
 * @property {String} pageToken Token for the next page of results
 */

/**
 * @typedef wix-bookings-backend~ListSlotsResponse
 * @property {Array<wix-bookings-backend~Session>} slots Slots on the calendar.
 * @property {String} nextPageToken Slots paging response.
Token for the next page of results
 */

/**
 * @function listSlots
 * @summary Returns the schedule slots, calculated by the schedule's availability specification.
Query object support:
- **filter**: supports
  - `scheduleIds`: scheduleIds represent the schedule of the sessions. Required.
    The Min list size is 1. all other filters are optional.
  - `from`: query range start time
  - `to`: query range end time
  - `isAvailable`: By default returned slots will include full capacity sessions. Filter.isAvailable = false is not supported.
- **fields**: supported.
- **paging**: Paging is supported using the page token. For paging the results, i.e. with a page size of 10, set the `query.paging.limit` to a value of `10`.
  The response will contain a value in the `nextPageToken` field. Pass this value in the `pageToken` field in the following calls and leave the `query` field empty.
- **fieldsets**: not supported.


**Query filter example:**
```
{"scheduleIds": ["66a2674c-9267-4600-826e-f463957b9446", "66a2674c-9267-4600-826e-f463957b9447"] , "from": "2019-02-17T13:08:43.000Z" , "to": "2019-02-17T14:08:43.000Z","isAvailable": true}).
```

> **Permissions**
> This endpoint requires the Read Bookings Calendar Availability, Read Bookings Calendar, Read Bookings - Public Data, Read Bookings - Including Participants or Manage Bookings permission scope.
 * @param {wix-bookings-backend~ListSlotsRequest} listSlotsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListSlotsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CalculateRequest
 * @property {String} couponCode
 * @property {wix-bookings-backend~PaidPlan} paidPlan
 * @property {String} id
 * @property {wix-bookings-backend~ContactDetails} contactDetails
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 * @property {Array<wix-bookings-backend~PaymentSelection>} paymentSelection
 */

/**
 * @typedef wix-bookings-backend~CalculateResponse
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails
 */

/**
 * @function calculate
 * @param {wix-bookings-backend~CalculateRequest} calculateRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CalculateResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CancelResponse
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails
 */

/**
 * @typedef wix-bookings-backend~CancelRequest
 * @property {String} id
 */

/**
 * @function cancel
 * @summary Change payment balance on an existing checkout.
 * @param {wix-bookings-backend~CancelRequest} cancelRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CancelResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CheckoutResponse
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails
 */

/**
 * @typedef wix-bookings-backend~CheckoutRequest
 * @property {String} couponCode
 * @property {wix-bookings-backend~PaidPlan} paidPlan
 * @property {String} id
 * @property {String} contactId member id for paid plans, may be valid only when identity is owner
 * @property {wix-bookings-backend~ContactDetails} contactDetails
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 * @property {Array<wix-bookings-backend~PaymentSelection>} paymentSelection
 */

/**
 * @function checkout
 * @summary a new checkout for a booking with given details.
 * @param {wix-bookings-backend~CheckoutRequest} checkoutRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CheckoutResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CheckoutOptions
 * @summary Checkout options.
 * @property {wix-bookings-backend~Payments} payments Transaction details.
 * @property {wix-bookings-backend~PaidPlans} paidPlans Paid plans available for checkout.
 */

/**
 * @typedef wix-bookings-backend~CheckoutOptionsResponse
 * @property {wix-bookings-backend~CheckoutOptions} checkoutOptions Checkout options.
 */

/**
 * @typedef wix-bookings-backend~Payments
 * @summary Transaction details.
 * @property {wix-bookings-backend~Price} finalPrice
 * @property {wix-bookings-backend~CouponDetails} couponDetails
 * @property {wix-bookings-backend~PaymentOptions} paymentOptions
 */

/**
 * @typedef wix-bookings-backend~CalendarDateTime
 * @summary The start time of the session. Required.
 * @property {Date} timestamp The time in seconds of UTC time since Unix epoch. Optional.
Required if the localDateTime field is not specified.
If the local date time is given then this field will be ignored and will be calculated from
the local date time and the business timezone.
 * @property {wix-bookings-backend~LocalDateTime} localDateTime The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {String} timeZone The time zone. Optional.
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~PaidPlans
 * @summary Paid plans available for checkout.
 * @property {wix-bookings-backend~Plan} defaultPlan The plan that should be used for checkout by default. calculated according to internal heuristic.
 * @property {Array<wix-bookings-backend~Plan>} plans Other plans available for checkout.
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Session
 * @summary A session that will be created for this booking.
 schedule_id, schedule_owner_id, start, and rate are used to calculate the checkout options.
 Start is used to access the relevant paid plans.
 * @property {wix-bookings-backend~Rate} rate The price options offered to participate this session. Optional. The default value is the schedule rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {wix-bookings-backend~CalendarConference} calendarConference Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} scheduleOwnerId The schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 * @property {Array<String>} tags Tags of the session. Optional. The default value is the tags in the schedule.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this session. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability.
Can be calculated from the schedule intervals or overridden on the Session.
Currently supported only for 1 schedule.
 * @property {Date} originalStart The original start time of the session in the result. Optional.
 * @property {String} id Identifier for this session when session is a single session or generated from recurring interval. Optional. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the schedule. (read-only, cannot be set in code)
 * @property {String} recurringIntervalId Recurring interval id. Read only. Optional.
Specified when the session was originally generated from schedule recurring interval. (read-only, cannot be set in code)
 * @property {Number} timeReservedAfter Time reserved after session end time. Read only.
Derived from the schedule availability constraints time between slots.
 * @property {String} status Status of the session. Optional. Possible values are: CONFIRMED, this is the default value.
CANCELLED, if this session was generated from recurring interval and then got deleted, or if it was created as a single session and then was deleted.
 * One of:
 *  + "UNDEFINED"
 *  + "CONFIRMED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session. Read only.
Calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {String} scheduleId Schedule identifier. The schedule of the session. Required.
Session must be under specific schedule.
 * @property {wix-bookings-backend~CalendarDateTime} end The end time of the session. Required.
The end time must be after the start time and with the same calendar date time field.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} notes The note of the session. Indicating additional information about the session. Optional.
The default is empty notes.
 * @property {String} title The textual title of the session, i.e. A service name. Optional. The default value is the title in the schedule.
 * @property {String} type The type of the session.
Can be event or working hours session that represent available time of the schedule owner.
The default is event.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "WORKING_HOURS"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {wix-bookings-backend~CalendarDateTime} start The start time of the session. Required.
 * @property {Number} capacity The maximum number of participants that can be added to the session. Optional.
The default value is the capacity in the schedule.
 */

/**
 * @typedef wix-bookings-backend~CheckoutOptionsRequest
 * @property {String} couponCode Coupon to apply to price calculations. An error will be thrown if given coupon is invalid.
 * @property {String} contactId Member ID for which paid plans will be accessed.
 * @property {wix-bookings-backend~PaymentSelection} paymentSelection Selected rate label (optional) to be used, and number of participants.
 * @property {wix-bookings-backend~schedule} schedule
 */

/**
 * @typedef wix-bookings-backend~Plan
 * @property {Number} creditOriginal
 * @property {Date} validUntil
 * @property {wix-bookings-backend~PaidPlan} paidPlan
 * @property {Date} validFrom
 * @property {String} planName
 * @property {Number} creditRemain
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~PaymentOptions
 * @property {Boolean} wixPayOnline Whether a booking made for this service can be paid online through Wix.
 * @property {Boolean} wixPayInPerson Whether a booking made for this service can be paid in person.
 * @property {Boolean} custom Whether a booking made for this service can be paid in a custom way which is up to the API user to define.
 * @property {Boolean} wixPaidPlan Whether a booking made for this service can be paid using Wix paid plans, e.g., memberships or packages.
 */

/**
 * @typedef wix-bookings-backend~schedule
 * @property {wix-bookings-backend~Session} createSession A session that will be created for this booking.
 schedule_id, schedule_owner_id, start, and rate are used to calculate the checkout options.
 Start is used to access the relevant paid plans.
 * @property {String} scheduleId Existing schedule ID. Will be used to access service properties including payment options, rate, and first session start time that will be used to access relevant plans.
 * @property {String} sessionId Existing session ID.
 */

/**
 * @typedef wix-bookings-backend~LocalDateTime
 * @summary The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {Number} hourOfDay
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @property {Number} monthOfYear
 * @property {Number} minutesOfHour
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @function checkoutOptions
 * @summary Calculates checkout options available to book and check out the given session/schedule.
> **Permissions**
> The API requires BOOKINGS.CHECKOUT_READ
 To calculate the Wix Paid Plans available for a site member using the `contactId` field, it is required to have the BOOKINGS.MANAGE permission.
 * @param {wix-bookings-backend~CheckoutOptionsRequest} checkoutOptionsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CheckoutOptionsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateOfflineOrderResponse
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails
 */

/**
 * @typedef wix-bookings-backend~CreateOfflineOrderRequest
 * @property {String} id
 * @property {wix-bookings-backend~ContactDetails} contactDetails
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 */

/**
 * @function createOfflineOrder
 * @summary Create an offline payment transaction
 * @param {wix-bookings-backend~CreateOfflineOrderRequest} createOfflineOrderRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateOfflineOrderResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateResponse
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails
 */

/**
 * @typedef wix-bookings-backend~UpdateRequest
 * @property {String} id
 * @property {String} updateAmountReceived
 * @property {wix-bookings-backend~ContactDetails} contactDetails
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 */

/**
 * @function update
 * @summary Change payment balance on an existing checkout.
 * @param {wix-bookings-backend~UpdateRequest} updateRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarEvent
 * @summary External calendar event.
 * @property {String} resourceId ID of resource holding the schedule synced to the external calendar.
 * @property {String} calendar External calendar type.
 * One of:
 *  + "GOOGLE"
 * @property {Date} start Event start time.
 * @property {Date} end Event end time.
 */

/**
 * @typedef wix-bookings-backend~Value
 * @property {wix-bookings-backend~kind} kind The kind of value.
 */

/**
 * @typedef wix-bookings-backend~Sorting
 * @property {String} fieldName Name of the field to sort by
 * @property {String} order Sort order (ASC/DESC). Defaults to ASC
 * One of:
 *  + "ASC"
 *  + "DESC"
 */

/**
 * @typedef wix-bookings-backend~ListEventsRequest
 * @property {wix-bookings-backend~Query} query
 */

/**
 * @typedef wix-bookings-backend~ListEventsResponse
 * @property {Array<wix-bookings-backend~ExternalCalendarEvent>} events External calendar events.
 */

/**
 * @typedef wix-bookings-backend~Paging
 * @summary Limit number of results
 * @property {Number} limit The number of items to load
 * @property {Number} offset number of items to skip in the current sort order
 */

/**
 * @typedef wix-bookings-backend~Query
 * @property {Array<String>} fieldsets Projection on the result object - list of named projections. E.g. "basic" will return id and name fields. Specifying multiple fieldsets will return the union of fields from all. Specifying fieldsets and fields will also return the union of fields.
 * @property {wix-bookings-backend~Value} filter A filter object. See documentation [here](https://bo.wix.com/wix-docs/rnd/platformization-guidelines/api-query-language#platformization-guidelines_api-query-language_defining-in-protobuf)
 * @property {wix-bookings-backend~Paging} paging Limit number of results
 * @property {Array<String>} fields Projection on the result object - list of specific field names to return. If fieldsets are also specified, return the union of fieldsets and fields
 * @property {Array<wix-bookings-backend~Sorting>} sort Sort object in the form [{"fieldName":"sortField1"},{"fieldName":"sortField2","direction":"DESC"}]
 */

/**
 * @typedef wix-bookings-backend~kind
 * @summary The kind of value.
 * @property {String} nullValue Represents a null value.
 * One of:
 *  + "NULL_VALUE"
 * @property {Boolean} boolValue Represents a boolean value.
 * @property {Number} numberValue Represents a double value.
 * @property {String} stringValue Represents a string value.
 * @property {Array<wix-bookings-backend~Value>} listValue Represents a repeated `Value`.
 * @property {Object} structValue Represents a structured value.
 */

/**
 * @function listEvents
 * @summary Lists the events pulled from the external calendar given the provided paging and filtering.
Query object support:
- **filter**: supports
  - `start`: query range end time. Required.
  - `end`: query range end time. Required.
  - `resourceId`: The external resource Id to which the external calendar is synced.
- **fields**: not supported.
- **paging**: not supported.
- **fieldsets**: not supported.
 > **Permissions**
 > This endpoint requires the Manage Bookings permission scope.
 * @param {wix-bookings-backend~ListEventsRequest} listEventsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListEventsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListStatusResponse
 * @property {Array<wix-bookings-backend~SyncStatus>} statuses List of sync statuses of all calendars under the meta-site.
 */

/**
 * @typedef wix-bookings-backend~ListStatusRequest
 */

/**
 * @function list
 * @summary Lists the statuses of all sync requests in the Wix site.
 * @param {wix-bookings-backend~ListStatusRequest} listStatusRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListStatusResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~RefreshCalendarRequest
 * @property {String} metaSiteId Metasite ID
 * @property {String} resourceId Synced resource ID
 */

/**
 * @typedef wix-bookings-backend~RefreshCalendarResponse
 */

/**
 * @function refreshCalendar
 * @param {wix-bookings-backend~RefreshCalendarRequest} refreshCalendarRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~RefreshCalendarResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~SendSyncEmailRequest
 * @property {String} resourceId Resource ID.
 * @property {String} syncRequestEmail Email address connected to the resource, to which the sync request will be sent.
 * @property {String} calendar Calendar type.
 * One of:
 *  + "GOOGLE"
 */

/**
 * @typedef wix-bookings-backend~SendSyncEmailResponse
 */

/**
 * @function sendSyncEmail
 * @summary Sends an email to the external calendar owner requesting sync approval.
 * @param {wix-bookings-backend~SendSyncEmailRequest} sendSyncEmailRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~SendSyncEmailResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~SyncStatusResponse
 * @property {Array<wix-bookings-backend~SyncStatus>} statuses List of sync statuses per calendar type.
 */

/**
 * @typedef wix-bookings-backend~SyncStatusRequest
 * @property {String} resourceId Resource ID.
 */

/**
 * @function syncStatus
 * @summary Gets the sync status for an external calendar.
 * @param {wix-bookings-backend~SyncStatusRequest} syncStatusRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~SyncStatusResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UnSyncResponse
 */

/**
 * @typedef wix-bookings-backend~UnSyncRequest
 * @property {String} resourceId Resource ID.
 * @property {String} calendar Calendar type.
 * One of:
 *  + "GOOGLE"
 */

/**
 * @function unSync
 * @summary Removes the sync to/from an external calendar.
 * @param {wix-bookings-backend~UnSyncRequest} unSyncRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UnSyncResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~AddParticipantResponse
 * @property {wix-bookings-backend~Participant} participant Participant.
 * @property {String} scheduleId Schedule ID.
 * @property {String} sessionId Session ID. Optional.
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 * @property {wix-bookings-backend~Session} session Session.
 */

/**
 * @typedef wix-bookings-backend~AddParticipantRequest
 * @summary Participants
 * @property {String} scheduleId Schedule ID. Required.
 * @property {String} sessionId Optional. If this field is given, the participant will be added to this specific session.
 * @property {wix-bookings-backend~Participant} participant Participant.
 */

/**
 * @function addParticipant
 * @summary Adds a participant to a schedule or to a specific session.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~AddParticipantRequest} addParticipantRequest Participants
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~AddParticipantResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~AssignWiXUserAsScheduleOwnerResponse
 * @property {String} uid The wix user id related to this schedule owner id. Required.
 * @property {String} scheduleOwnerId Schedule owner id. e.g, in case of schedule of a staff member, can be staff member id.
 */

/**
 * @typedef wix-bookings-backend~AssignWiXUserAsScheduleOwnerRequest
 * @summary schedule owner
 * @property {String} uid The wix user id. Required.
 * @property {String} scheduleOwnerId Schedule owner id assigned to the user id. e.g, in case of schedule of a staff member, can be staff member id.
 * @property {String} msId The meta site id related to this schedule owner id. Required.
 */

/**
 * @function assignWiXUserAsScheduleOwner
 * @summary Assign wix user to schedule owner id.
 * @param {wix-bookings-backend~AssignWiXUserAsScheduleOwnerRequest} assignWiXUserAsScheduleOwnerRequest schedule owner
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~AssignWiXUserAsScheduleOwnerResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchRequest
 * @property {Array<wix-bookings-backend~CreateScheduleRequest>} createRequests Create multiple schedules.
 * @property {Array<wix-bookings-backend~UpdateScheduleRequest>} updateRequests Update multiple schedules. Not Supported yet.
 * @property {Array<wix-bookings-backend~CancelScheduleRequest>} cancelRequests Cancel multiple schedules.
The given schedules move to a CANCELLED status which means that all sessions up until
the cancellation point in time are kept, while removing all following sessions.
 */

/**
 * @typedef wix-bookings-backend~BatchResponse
 * @property {Array<wix-bookings-backend~Schedule>} created Created schedules.
 * @property {Array<wix-bookings-backend~Schedule>} updated Updated schedules.
 * @property {Array<wix-bookings-backend~Schedule>} cancelled Cancelled schedules.
 */

/**
 * @function batch
 * @summary Create update and cancel multiple schedules.
 * @param {wix-bookings-backend~BatchRequest} batchRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchCancelScheduleResponse
 * @property {Array<wix-bookings-backend~Schedule>} schedules Schedule.
 */

/**
 * @typedef wix-bookings-backend~BatchCancelScheduleRequest
 * @property {Array<wix-bookings-backend~CancelScheduleRequest>} requests
 */

/**
 * @function batchCancel
 * @summary Cancels multiple schedules.
By applying this method, the given schedule move to a CANCELLED status which means that all sessions up until.
the cancellation point in time are kept, while removing all following sessions.
 * @param {wix-bookings-backend~BatchCancelScheduleRequest} batchCancelScheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchCancelScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchCreateScheduleResponse
 * @property {Array<wix-bookings-backend~Schedule>} schedules Schedule.
 */

/**
 * @typedef wix-bookings-backend~BatchCreateScheduleRequest
 * @property {Array<wix-bookings-backend~Schedule>} schedules Schedule.
 */

/**
 * @function batchCreate
 * @param {wix-bookings-backend~BatchCreateScheduleRequest} batchCreateScheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchCreateScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CancelScheduleResponse
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 */

/**
 * @function cancel
 * @summary Cancels a schedule. Equivalent to batch cancel of sessions linked to a single schedule.
The schedule changes to status = CANCELED -  all sessions up until the time of cancellation are kept, and all future sessions are removed.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~CancelScheduleRequest} cancelScheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CancelScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateScheduleResponse
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 * @property {Array<wix-bookings-backend~Error>} errors
 */

/**
 * @typedef wix-bookings-backend~Error
 * @property {String} message
 * @property {String} code
 */

/**
 * @function create
 * @summary Creates a schedule.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~CreateScheduleRequest} createScheduleRequest schedule
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateSessionRequest
 * @summary Schedule's session
 * @property {wix-bookings-backend~Session} session Session.
 * @property {wix-bookings-backend~FieldMask} deleted Session fields to revert to empty, in order to revert to the data inherited from the schedule.
 */

/**
 * @typedef wix-bookings-backend~CreateSessionResponse
 * @property {wix-bookings-backend~Session} session Session.
 */

/**
 * @function createSession
 * @summary Creates a session (adds a session to a schedule).
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~CreateSessionRequest} createSessionRequest Schedule's session
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateSessionResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~DeleteSessionResponse
 * @property {String} id Session ID.
 */

/**
 * @typedef wix-bookings-backend~DeleteSessionRequest
 * @property {String} id Session ID. Required.
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @function deleteSession
 * @summary Deletes a session from a schedule.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~DeleteSessionRequest} deleteSessionRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeleteSessionResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~GetScheduleResponse
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 */

/**
 * @typedef wix-bookings-backend~GetScheduleRequest
 * @property {String} id Schedule ID.
 */

/**
 * @function get
 * @summary Returns a schedule from the calendar.
> **Permissions**
> This endpoint requires the Read Bookings Calendar or the Manage Bookings permissions scope.
> With the Read Bookings Calendar permission scope, the schedule participants are not returned.
 * @param {wix-bookings-backend~GetScheduleRequest} getScheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~GetSessionRequest
 * @property {String} id Session ID.
 */

/**
 * @typedef wix-bookings-backend~GetSessionResponse
 * @property {wix-bookings-backend~Session} session Session.
 */

/**
 * @function getSession
 * @summary Returns a session from the calendar.
> **Permissions**
> This endpoint requires the Read Bookings Calendar or the Manage Bookings permission scope.
> With the Read Bookings Calendar permission scope, the session participants are not returned.
 * @param {wix-bookings-backend~GetSessionRequest} getSessionRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetSessionResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListSchedulesResponse
 * @property {Array<wix-bookings-backend~Schedule>} schedules Schedule.
 */

/**
 * @typedef wix-bookings-backend~ListSchedulesRequest
 * @property {Array<String>} scheduleIds List by schedule IDs.
 * @property {Array<String>} scheduleOwnerIds List by schedule owner IDs.
 * @property {Boolean} dontIncludeScheduleParticipants Whether to return a list of the schedule's participants.
 */

/**
 * @function list
 * @summary Lists schedules by schedule IDs or schedule owner IDs.
> **Permissions**
> This endpoint requires the Read Bookings Calendar or the Manage Bookings  permission scope.
> With the Read Bookings Calendar permission scope, the schedule participants are not returned.
 * @param {wix-bookings-backend~ListSchedulesRequest} listSchedulesRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListSchedulesResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListSessionsRequest
 * @property {Array<String>} ids Session ID.
 * @property {wix-bookings-backend~FieldMask} fieldMask Field mask of fields to return. Currently only supports the "scheduleOwnerId" field.
 */

/**
 * @typedef wix-bookings-backend~ListSessionsResponse
 * @property {Array<wix-bookings-backend~Session>} sessions Session.
 */

/**
 * @function listSessions
 * @summary Returns multiple sessions from the calendar.
> **Permissions**
> This endpoint requires the Read Bookings Calendar or the Manage Bookings permission scope
> With the Read Bookings Calendar permission scope, the sessions return without participants.
 * @param {wix-bookings-backend~ListSessionsRequest} listSessionsRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListSessionsResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~MigrateResponse
 * @property {Array<wix-bookings-backend~MigrateResponseEntry>} results
 */

/**
 * @typedef wix-bookings-backend~MigrateRequest
 * @property {Array<String>} csvList
 */

/**
 * @typedef wix-bookings-backend~MigrateResponseEntry
 * @property {String} key
 * @property {String} errorMessage
 */

/**
 * @function migrate
 * @param {wix-bookings-backend~MigrateRequest} migrateRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~MigrateResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~RemoveParticipantResponse
 * @property {String} id Participant ID.
 */

/**
 * @typedef wix-bookings-backend~RemoveParticipantRequest
 * @property {String} id Participant ID.
 */

/**
 * @function removeParticipant
 * @summary Removes a participant from a schedule or from a specific session.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~RemoveParticipantRequest} removeParticipantRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~RemoveParticipantResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~SplitIntervalResponse
 * @property {Array<wix-bookings-backend~RecurringInterval>} intervals A list of intervals where the first is the modified original interval followed by other newly created intervals.
 */

/**
 * @typedef wix-bookings-backend~SplitIntervalRequest
 * @property {String} scheduleId Schedule ID.
 * @property {String} intervalId Interval ID.
 * @property {Array<Date>} splitTimes A list of times where the interval is to be split. Must not be in the past. Must not contain duplicate times.
 */

/**
 * @function splitInterval
 * @summary Splits an existing interval into two or more parts.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~SplitIntervalRequest} splitIntervalRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~SplitIntervalResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UnAssignWiXUserFromScheduleOwnerResponse
 * @property {String} scheduleOwnerId Schedule owner id. e.g, in case of schedule of a staff member, can be staff member id.
 */

/**
 * @typedef wix-bookings-backend~UnAssignWiXUserFromScheduleOwnerRequest
 * @summary schedule owner
 * @property {String} uid The wix user id. Required.
 * @property {String} scheduleOwnerId Schedule owner id. e.g, in case of schedule of a staff member, can be staff member id.
 * @property {String} msId The meta site id related to this schedule owner id. Required.
 */

/**
 * @function unAssignWiXUserFromScheduleOwner
 * @summary remove wix user assignment from schedule owenr id.
 * @param {wix-bookings-backend~UnAssignWiXUserFromScheduleOwnerRequest} unAssignWiXUserFromScheduleOwnerRequest schedule owner
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UnAssignWiXUserFromScheduleOwnerResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateScheduleResponse
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 */

/**
 * @function update
 * @summary Updates a schedule.
This method supports patch semantics. The field values you specify replace the existing values.
Fields that you don’t specify in the request remain unchanged.
 Array fields, if specified, overwrite the existing arrays; this discards any previous array elements.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~UpdateScheduleRequest} updateScheduleRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateScheduleResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateIntervalRequest
 * @property {String} scheduleId Schedule ID.
 * @property {wix-bookings-backend~RecurringInterval} interval Recurring Interval
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @typedef wix-bookings-backend~UpdateIntervalResponse
 */

/**
 * @function updateInterval
 * @summary Updates an existing recurring interval.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~UpdateIntervalRequest} updateIntervalRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateIntervalResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateParticipantResponse
 * @property {wix-bookings-backend~Participant} participant Participant.
 */

/**
 * @typedef wix-bookings-backend~UpdateParticipantRequest
 * @property {wix-bookings-backend~Participant} participant Participant to update, identified by the ID field.
 * @property {wix-bookings-backend~FieldMask} fieldMask Field mask of fields to update.
 */

/**
 * @function updateParticipant
 * @summary Updates participant details.
 The field values you specify replace the existing values. Fields that you don’t specify in the request remain unchanged.
Array fields, if specified, overwrite the existing arrays; this discards any previous array elements.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~UpdateParticipantRequest} updateParticipantRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateParticipantResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateSessionResponse
 * @property {wix-bookings-backend~Session} session Session.
 */

/**
 * @typedef wix-bookings-backend~UpdateSessionRequest
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification
 * @property {wix-bookings-backend~FieldMask} updated Field mask of fields to update.
 * @property {wix-bookings-backend~Session} session Session.
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 * @property {wix-bookings-backend~FieldMask} deleted Session fields to revert to empty, in order to revert to the data inherited from the schedule.
 */

/**
 * @function updateSession
 * @summary Updates a session.
The field values you specify replace the existing values. Fields that you don’t specify in the request remain unchanged.
 Array fields, if specified, overwrite the existing arrays; this discards any previous array elements.
> **Permissions**
> This endpoint requires the Manage Bookings permissions scope
 * @param {wix-bookings-backend~UpdateSessionRequest} updateSessionRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateSessionResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchCreateResourceRequest
 * @property {Array<wix-bookings-backend~Resource>} resources List of resource entities to create.
 */

/**
 * @typedef wix-bookings-backend~BatchCreateResourceResponse
 * @property {Array<wix-bookings-backend~Resource>} resources List of created resources.
 */

/**
 * @function batchCreate
 * @summary Creates multiple resources with corresponding schedules.
 * @param {wix-bookings-backend~BatchCreateResourceRequest} batchCreateResourceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchCreateResourceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteResourceRequest
 * @property {Array<String>} ids List of resource IDs to be deleted.
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteResourceResponse
 */

/**
 * @function batchDelete
 * @param {wix-bookings-backend~BatchDeleteResourceRequest} batchDeleteResourceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchDeleteResourceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateResourceResponse
 * @property {wix-bookings-backend~Resource} resource Created resource.
 */

/**
 * @typedef wix-bookings-backend~CreateResourceRequest
 * @property {wix-bookings-backend~Resource} resource Resource to create.
 */

/**
 * @function create
 * @summary Creates a resource.
 * @param {wix-bookings-backend~CreateResourceRequest} createResourceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateResourceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~DeleteResourceResponse
 */

/**
 * @typedef wix-bookings-backend~DeleteResourceRequest
 * @property {String} id ID of the resource to delete.
 */

/**
 * @function delete
 * @summary Deletes a resource. Deleting a resource cancels its schedule.
 * @param {wix-bookings-backend~DeleteResourceRequest} deleteResourceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeleteResourceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListResourcesRequest
 * @property {wix-bookings-backend~Query} query
 */

/**
 * @typedef wix-bookings-backend~Value
 * @property {wix-bookings-backend~kind} kind The kind of value.
 */

/**
 * @typedef wix-bookings-backend~Sorting
 * @property {String} fieldName Name of the field to sort by
 * @property {String} order Sort order (ASC/DESC). Defaults to ASC
 * One of:
 *  + "ASC"
 *  + "DESC"
 */

/**
 * @typedef wix-bookings-backend~Paging
 * @summary Limit number of results
 * @property {Number} limit The number of items to load
 * @property {Number} offset number of items to skip in the current sort order
 */

/**
 * @typedef wix-bookings-backend~Query
 * @property {Array<String>} fieldsets Projection on the result object - list of named projections. E.g. "basic" will return id and name fields. Specifying multiple fieldsets will return the union of fields from all. Specifying fieldsets and fields will also return the union of fields.
 * @property {wix-bookings-backend~Value} filter A filter object. See documentation [here](https://bo.wix.com/wix-docs/rnd/platformization-guidelines/api-query-language#platformization-guidelines_api-query-language_defining-in-protobuf)
 * @property {wix-bookings-backend~Paging} paging Limit number of results
 * @property {Array<String>} fields Projection on the result object - list of specific field names to return. If fieldsets are also specified, return the union of fieldsets and fields
 * @property {Array<wix-bookings-backend~Sorting>} sort Sort object in the form [{"fieldName":"sortField1"},{"fieldName":"sortField2","direction":"DESC"}]
 */

/**
 * @typedef wix-bookings-backend~ListResourcesResponse
 * @property {Array<wix-bookings-backend~Resource>} resources List of resources matching the query object.
 * @property {wix-bookings-backend~QueryMetaData} metadata
 */

/**
 * @typedef wix-bookings-backend~QueryMetaData
 * @property {Number} items
 * @property {Number} offset
 * @property {Number} totalCount
 */

/**
 * @typedef wix-bookings-backend~kind
 * @summary The kind of value.
 * @property {String} nullValue Represents a null value.
 * One of:
 *  + "NULL_VALUE"
 * @property {Boolean} boolValue Represents a boolean value.
 * @property {Number} numberValue Represents a double value.
 * @property {String} stringValue Represents a string value.
 * @property {Array<wix-bookings-backend~Value>} listValue Represents a repeated `Value`.
 * @property {Object} structValue Represents a structured value.
 */

/**
 * @function list
 * @summary Queries the business' resources.
The query is optional, if no query is provided than the non-deleted resources will be returned.
Query object support:
- filter: supports "resource.id", "resource.tag", "resource.status".
- paging: supported.
- fields: supported.
- paging: not supported.
- fields: not supported.
- fieldsets: not supported.

> **Permissions**
> This endpoint requires the Read Bookings Calendar, Read Bookings - Public Data, Read Bookings - Including Participants or Manage Bookings permission scope.
 * @param {wix-bookings-backend~ListResourcesRequest} listResourcesRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListResourcesResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateResourceRequest
 * @property {wix-bookings-backend~Resource} resource Updated resource.
 * @property {wix-bookings-backend~FieldMask} fieldMask Field mask of fields to update.
 */

/**
 * @typedef wix-bookings-backend~UpdateResourceResponse
 */

/**
 * @typedef wix-bookings-backend~FieldMask
 * @summary Field mask of fields to update.
 * @property {Array<String>} paths The set of field mask paths.
 */

/**
 * @function update
 * @summary Updates a resource. Can be used also to update the resource's schedules.
 * @param {wix-bookings-backend~UpdateResourceRequest} updateResourceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateResourceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchCreateCategoryRequest
 * @property {Array<wix-bookings-backend~Category>} categories Category data.
 */

/**
 * @typedef wix-bookings-backend~BatchCreateCategoryResponse
 * @property {Array<wix-bookings-backend~Category>} categories Category data.
 */

/**
 * @function batchCreate
 * @summary Creates multiple new categories.
 * @param {wix-bookings-backend~BatchCreateCategoryRequest} batchCreateCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchCreateCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteCategoryResponse
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteCategoryRequest
 * @property {Array<String>} ids Category ID.
 */

/**
 * @function batchDelete
 * @summary Deletes multiple categories.
 * @param {wix-bookings-backend~BatchDeleteCategoryRequest} batchDeleteCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchDeleteCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchUpdateCategoryResponse
 */

/**
 * @typedef wix-bookings-backend~BatchUpdateCategoryRequest
 * @property {Array<wix-bookings-backend~Category>} categories List of categories to be updated
 * @property {wix-bookings-backend~FieldMask} fieldMask field mask of fields to update
 */

/**
 * @function batchUpdate
 * @summary Updates multiple categories.
 * @param {wix-bookings-backend~BatchUpdateCategoryRequest} batchUpdateCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchUpdateCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateCategoryRequest
 * @property {wix-bookings-backend~Category} category Category data.
 */

/**
 * @typedef wix-bookings-backend~CreateCategoryResponse
 * @property {wix-bookings-backend~Category} category Category data.
 */

/**
 * @function create
 * @summary Creates a new category.
 * @param {wix-bookings-backend~CreateCategoryRequest} createCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~DeleteCategoryResponse
 */

/**
 * @typedef wix-bookings-backend~DeleteCategoryRequest
 * @property {String} id Category ID.
 * @property {Boolean} deleteServices Cascade delete all the services in this category. Defaults to false (when false, the services will still exist but will not be accessible in the Wix Business Manager).
 */

/**
 * @function delete
 * @summary Deletes a category.
 * @param {wix-bookings-backend~DeleteCategoryRequest} deleteCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeleteCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListCategoryRequest
 * @property {Array<String>} categoryIds Category IDs.
 * @property {Boolean} includeDeleted Whether deleted categories are included. Defaults to false.
 */

/**
 * @typedef wix-bookings-backend~ListCategoryResponse
 * @property {Array<wix-bookings-backend~Category>} categories Category data.
 */

/**
 * @function list
 * @summary Lists all categories.

> **Permissions**
> This endpoint requires the Read Bookings - Public Data or the Read Bookings - Including Participants permissions scope
 * @param {wix-bookings-backend~ListCategoryRequest} listCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateCategoryResponse
 */

/**
 * @typedef wix-bookings-backend~UpdateCategoryRequest
 * @property {wix-bookings-backend~Category} category
 */

/**
 * @function update
 * @summary Updates an existing category.
 * @param {wix-bookings-backend~UpdateCategoryRequest} updateCategoryRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateCategoryResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateFormRequest
 * @property {wix-bookings-backend~Form} form The form to be created
 */

/**
 * @typedef wix-bookings-backend~CreateFormResponse
 * @property {wix-bookings-backend~Form} form The created form
 */

/**
 * @function create
 * @summary Creates a form.
 * @param {wix-bookings-backend~CreateFormRequest} createFormRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateFormResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~DeleteFormRequest
 * @property {String} id Id of the form to be deleted.
 */

/**
 * @typedef wix-bookings-backend~DeleteFormResponse
 * @property {String} id Id of the form which was deleted, if successful
 */

/**
 * @function delete
 * @summary Delete a form
 * @param {wix-bookings-backend~DeleteFormRequest} deleteFormRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeleteFormResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function get
 * @summary Gets a form
> **Permissions**
> This endpoint requires the Read Bookings - Public Data or Read Bookings - Including Participants permissions scope
 * @param {wix-bookings-backend~GetFormRequest} getFormRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetFormResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateFormRequest
 * @property {wix-bookings-backend~Form} form The updated form. Must include the form Id
 */

/**
 * @typedef wix-bookings-backend~UpdateFormResponse
 * @property {wix-bookings-backend~Form} form The updated form
 */

/**
 * @function update
 * @summary Updates a form.
 * @param {wix-bookings-backend~UpdateFormRequest} updateFormRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateFormResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~GetPolicyRequest
 */

/**
 * @typedef wix-bookings-backend~GetPolicyResponse
 * @property {wix-bookings-backend~BusinessServicesPolicy} policy Service policy.
 */

/**
 * @function get
 * @param {wix-bookings-backend~GetPolicyRequest} getPolicyRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetPolicyResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdatePolicyRequest
 * @property {wix-bookings-backend~BusinessServicesPolicy} policy Service policy.
 */

/**
 * @typedef wix-bookings-backend~UpdatePolicyResponse
 */

/**
 * @function update
 * @param {wix-bookings-backend~UpdatePolicyRequest} updatePolicyRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdatePolicyResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchCreateServiceRequest
 * @property {Array<wix-bookings-backend~CreateServiceRequest>} requests
 */

/**
 * @typedef wix-bookings-backend~BatchCreateServiceResponse
 * @property {Array<String>} ids The Id of the created service.
 */

/**
 * @function batchCreate
 * @param {wix-bookings-backend~BatchCreateServiceRequest} batchCreateServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchCreateServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteServiceRequest
 * @property {Array<String>} ids The Id of the service to delete
 */

/**
 * @typedef wix-bookings-backend~BatchDeleteServiceResponse
 */

/**
 * @function batchDelete
 * @param {wix-bookings-backend~BatchDeleteServiceRequest} batchDeleteServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchDeleteServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateResult
 * @property {wix-bookings-backend~result} result
 */

/**
 * @typedef wix-bookings-backend~BatchUpdateResponse
 * @property {Array<wix-bookings-backend~UpdateResult>} results
 */

/**
 * @typedef wix-bookings-backend~result
 * @property {wix-bookings-backend~Service} updatedService
 * @property {String} error
 */

/**
 * @typedef wix-bookings-backend~BatchUpdateRequest
 * @summary Updated a set of services
 * @property {Array<wix-bookings-backend~Service>} services The list of services with the updated information. Each service must contain the Id of the service to update.
 * @property {wix-bookings-backend~FieldMask} fieldMask A field mask of fields to update
 */

/**
 * @function batchUpdate
 * @param {wix-bookings-backend~BatchUpdateRequest} batchUpdateRequest Updated a set of services
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BatchUpdateResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BulkFixInput
 * @property {Array<wix-bookings-backend~FixInput>} inputs
 */

/**
 * @typedef wix-bookings-backend~FixInput
 * @property {String} instanceId
 * @property {String} serviceId
 */

/**
 * @function bulkFix
 * @param {wix-bookings-backend~BulkFixInput} bulkFixInput
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BulkFixInput}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CreateServiceResponse
 * @property {String} id The Id of the created service.
 */

/**
 * @function create
 * @summary Creates a service
 * @param {wix-bookings-backend~CreateServiceRequest} createServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~CreateServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~DeleteServiceRequest
 * @summary Delete s service
 * @property {String} id The Id of the service to delete
 * @property {Boolean} preserveFutureSessionsWithParticipants Whether to preserve future sessions with participants. Optional, default is false.
 * @property {Boolean} notifyParticipants Whether to notify participants about cancelled sessions due to a service being deleted. Optional, default is false. deprecated, use participant_notification
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 */

/**
 * @typedef wix-bookings-backend~DeleteServiceResponse
 */

/**
 * @function delete
 * @summary Deletes a service
 * @param {wix-bookings-backend~DeleteServiceRequest} deleteServiceRequest Delete s service
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~DeleteServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~GetServiceRequest
 * @property {String} id Requested service Id
 */

/**
 * @typedef wix-bookings-backend~GetServiceResponse
 * @property {wix-bookings-backend~Service} service Requested service
 */

/**
 * @function get
 * @summary Retrieves a service by Id
> **Permissions**
> This endpoint requires the Read Bookings - Public Data or Read Bookings - Including Participants permissions scope
 * @param {wix-bookings-backend~GetServiceRequest} getServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~ListServiceRequest
 * @property {Boolean} includeDeleted Optional. Default is false
 */

/**
 * @typedef wix-bookings-backend~ListServiceResponse
 * @property {Array<wix-bookings-backend~Service>} services List of all retrieved services
 */

/**
 * @function list
 * @summary Lists all services in the business
> **Permissions**
> This endpoint requires the Read Bookings - Public Data or Read Bookings - Including Participants permissions scope
 * @param {wix-bookings-backend~ListServiceRequest} listServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function update
 * @summary Updated a service
 * @param {wix-bookings-backend~UpdateServiceRequest} updateServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~UpdateServiceResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function get
 * @summary Gets the entire data available in the services and business catalog
 * @param {wix-bookings-backend~BulkRequest} bulkRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BulkResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function get
 * @param {wix-bookings-backend~GetBusinessRequest} getBusinessRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetBusinessResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~BackOfficeListResponse
 * @property {Boolean} haveServices
 */

/**
 * @typedef wix-bookings-backend~BackOfficeListRequest
 * @property {String} id
 */

/**
 * @function backOfficeList
 * @param {wix-bookings-backend~BackOfficeListRequest} backOfficeListRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~BackOfficeListResponse}
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function get
 * @summary Retrieves a service, including all its data.

> **Permissions**
> This endpoint requires the Read Bookings - Public Data, the Read Bookings - Including Participants or the Manage Bookings permissions scope
 * @param {wix-bookings-backend~GetServiceRequest} getServiceRequest
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~GetServiceResponse} A full catalog detailed response containing all the information related to a service.
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @function list
 * @summary Retrieves a list of services, given the provided filtering.
 Returns a list of enriched services; Based on the invoker permissions and the request query.
Query object support:
- **filter**: supports
  - `service.id` - query for a specific service.
    Example: ```"filter { string_value: "{ "service.id": "46ce4cd4-46ff-4aa7-9cc0-02fd4f0f3209" }" }"```.
  - `category.id` - query for all services that belongs to the category.
    Example: ```"filter { string_value: "{ "category.id": "55ce4cd4-46ff-4aa7-9cc0-01fd4f0f3209" }" }"```.
  - `service.info.name` - query for all services with given name.
    Example: ```"filter { string_value: "{ "service.info.name": "haircut" }" }"```.
  - `service.info.tagLine` - query for all services with given tag line.
    Example: ```"filter { string_value: "{ "service.info.tagLine": "short haircut" }" }"```.
  - `service.policy.isBookOnlineAllowed` - query for all services that can be booked online.
    Example: ```"filter { string_value: "{ "service.policy.isBookOnlineAllowed": true }" }"```.
  - `category.name` - query for all services that belongs to categories with given name.
    Example: ```"filter { string_value: "{ "categoty.name": "hair services" }" }"```.
  - `service.customProperties.tag` - query for all services that has given tag.
    Example: ```"filter { string_value: "{ "service.customProperties.tag": "hair services" }" }"```.
  - `service.paymentOptions.wixPayOnline` - query for all services that can be payed Online with Wix Pay.
    Example: ```"filter { string_value: "{ "service.paymentOptions.wixPayOnline": true }" }"```.
  - `service.paymentOptions.wixPayInPerson` - query for all services that be payed Offline with Wix Pay..
    Example: ```"filter { string_value: "{ "service.paymentOptions.wixPayInPerson": true }" }"```.
  - `service.paymentOptions.wixPaidPlan` - query for all services that can be booked using a paid plan.
    Example: ```"filter { string_value: "{ "service.paymentOptions.wixPaidPlan": true }" }"```.
  - `service.paymentOptions.custom` - query for all services that has a custom payment method.
    Example: ```"filter { string_value: "{ "service.paymentOptions.custom": true }" }"```.
  - `slugs.name` - query for service with given slug.
    Example: ```"filter { string_value: "{ "slugs.name": "woman-hair-cut" }" }"```.
  - `schedules.tags` - query for all services that has a schedule with given tag.
    Example: ```"filter { string_value: "{ "schedules.tags": "Group" }" }"```.
  - `resources.id` - query for all services that are given by a given resource.
    Example: ```"filter { string_value: "{ "resources.id": "46ce4cd4-46ff-4aa7-9cc0-02fd4f0f3209" }" }"```.
  - `service.policy.bookingsApprovalPolicy.isBusinessApprovalRequired` - query for all services that require business approval.
    Example: ```"filter { string_value: "{ "service.policy.bookingsApprovalPolicy.isBusinessApprovalRequired": true }" }"```.
- **paging**: Supported. Limit Example: "query { paging { limit { value: 10 } } }". Offset Example: "query { paging { offset { value: 10 } } }".
- **fieldsets**: not supported.
- **fields**: any projection is supported.
    Example: query { fields ["service.id", "service.status", "service.info.name"] }
**Important**:
  Calling List without any filter, will return all non deleted services.
- All results are for one specific business, resolved from the request context.

> **Permissions**
> This endpoint requires the Read Bookings - Public Data, the Read Bookings - Including Participants or the Manage Bookings permissions scope
 * @param {wix-bookings-backend~ListServicesRequest} listServicesRequest List catalog items request
 * @returns {Promise}
 * @fulfill {wix-bookings-backend~ListServicesResponse} A list of catalog service response.
 * @memberof wix-bookings-backend
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~WaitingListPolicy
 * @summary Waitlist policy for the service. Empty by default.
 * @property {Boolean} isEnabled Whether waitlisting is enabled for the service.
 * @property {Number} capacity Number of spots available in waitlist. Defaults to 10 spots.
 * @property {Number} timeWindowMinutes Amount of time each participant is given to book once notified that a spot is available. Defaults to 10 minutes.
 */

/**
 * @typedef wix-bookings-backend~UpdateServiceRequest
 * @property {wix-bookings-backend~BatchRequest} scheduleActions Actions to perform on the service's schedules. Can contain schedules to create, update, and cancel. Either the 'schedules' or 'schedule_actions' should be specified but not both.
 * @property {Array<wix-bookings-backend~Schedule>} schedules List of schedules to be updated for that service. These schedules should be an updated schedules of schedules which already associated to this service. Either the 'schedules' or 'schedule_actions' should be specified but not both.
 * @property {wix-bookings-backend~Service} service The service entity to update.
 * @property {Boolean} notifyParticipants Whether to notify participants about changed sessions. deprecated, use participant_notification
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 */

/**
 * @typedef wix-bookings-backend~BatchRequest
 * @summary Actions to perform on the service's schedules. Can contain schedules to create, update, and cancel. Either the 'schedules' or 'schedule_actions' should be specified but not both.
 * @property {Array<wix-bookings-backend~CreateScheduleRequest>} createRequests Create multiple schedules.
 * @property {Array<wix-bookings-backend~UpdateScheduleRequest>} updateRequests Update multiple schedules. Not Supported yet.
 * @property {Array<wix-bookings-backend~CancelScheduleRequest>} cancelRequests Cancel multiple schedules.
The given schedules move to a CANCELLED status which means that all sessions up until
the cancellation point in time are kept, while removing all following sessions.
 */

/**
 * @typedef wix-bookings-backend~Form
 * @summary The requested form
 * @property {wix-bookings-backend~FormField} numberOfParticipants Number of participants being booked to the service (displayed in Wix Bookings UI only for services that allow booking multiple people per booking).
 * @property {wix-bookings-backend~FormField} name Customer's name.
 * @property {wix-bookings-backend~FormField} email Customer's email address.
 * @property {Array<wix-bookings-backend~FormField>} customFields Custom fields which can be added to the form.
 * @property {wix-bookings-backend~ActionLabels} actionLabels Available payment actions.
 * @property {String} id Form ID. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~AddressFields} address Customer's address (displayed in Wix Bookings UI only when a service’s location is set to "Customer’s Place").
 * @property {wix-bookings-backend~Header} header Form header
 * @property {wix-bookings-backend~FormField} phone Customer's phone number.
 */

/**
 * @typedef wix-bookings-backend~UpdateScheduleRequest
 * @property {wix-bookings-backend~FieldMask} fieldMask Field mask of fields to update.
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification.
 * @property {Boolean} alignTimeExceptions Optional. Defaults to false. In case of updated intervals' start time, this field indicates whether to align those interval's time exceptions.
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @typedef wix-bookings-backend~Schedule
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {wix-bookings-backend~CalendarConference} calendarConference A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {Date} firstSessionStart The start time of the schedule. Read only. calculated by the start time of the first session. (read-only, cannot be set in code)
 * @property {String} scheduleOwnerId The id of the schedule's owner. e.g, in case of schedule of a service, service id.
 * @property {Array<wix-bookings-backend~RecurringInterval>} intervals Specifies the intervals for the sessions calculation. Optional. e.g. when creating class service you can add
pattern for recurring intervals, these intervals can be returned as schedule's sessions or available slots if
there are no other availability calculation constraints and the capacity is bigger then the current total number
of sessions' participants.
 * @property {Array<String>} tags Tags of the schedule. Optional. e.g., tag as service type. Google sessions tag as "Google".
This is the default tags of the schedule's sessions.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this schedule. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~Availability} availability Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} lastSessionEnd The end time of the schedule. Read only. calculated by the end time of the last session. (read-only, cannot be set in code)
 * @property {Number} version the schedule's version (read-only, cannot be set in code)
 * @property {String} id Schedule identifier.
 * @property {Date} updated The time when this schedule was last modified. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the business. (read-only, cannot be set in code)
 * @property {String} status The schedule's status. Optional.
Possible values are: CREATED, This is the default status. CANCELLED, the schedule was cancelled.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this schedule when this schedule is a bookable slot. Read only.
calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ConferenceProvider} conferenceProvider Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title The textual title of the schedule. Optional.
This is the default title of the schedule's sessions. i.e., a service name. Max length: 6000.
 * @property {String} timeZone The time zone of the schedule. Optional.
 * @property {Date} created The time when this schedule was created. (read-only, cannot be set in code)
 * @property {Number} capacity The maximum number of participants that can be added to this schedule's slots. Optional.
The default is 1. This is the default capacity of the schedule's sessions. minimum: 1, maximum: 1000
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~ServiceInfo
 * @summary Information about the service.
 * @property {String} name Service name.
 * @property {String} description Service description.
 * @property {Array<wix-bookings-backend~Image>} images Images associated with this service.
 * @property {String} tagLine Service description - short version.
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Availability
 * @summary Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} start The time the schedule starts to be available for booking. Required.
 * @property {Date} end The time schedule stops to be available for booking. Optional. Empty value indicates that there is no end time.
 * @property {Array<wix-bookings-backend~LinkedSchedule>} linkedSchedules Reference to other schedules for availability calculations. Optional.
Supported only when there are no recurring intervals and with availability calculation constraints.
 * @property {wix-bookings-backend~AvailabilityConstraints} constraints Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 */

/**
 * @typedef wix-bookings-backend~Header
 * @summary Form header
 * @property {String} description Form description (displayed below the header in Wix Bookings UI).
 * @property {String} title Form title.
 * @property {Boolean} isDescriptionHidden Whether the form description should be displayed in the Wix Bookings UI.
 */

/**
 * @typedef wix-bookings-backend~TextLabel
 * @property {String} label Additional label applied to this text-only field.
 */

/**
 * @typedef wix-bookings-backend~FutureBookingPolicy
 * @summary Advance booking policy - how far in advance a participant can book sessions, calculated from the current time.
 * @property {Boolean} shouldLimit Whether a limit should be imposed on advance bookings.
 * @property {Number} limitXMinutesToTheFuture How far in advance a participant can book a session, calculated from the current time. Defaults to 10,080 minutes (3 days).
 */

/**
 * @typedef wix-bookings-backend~BookingsApprovalPolicy
 * @summary Bookings approval policy for this service. Empty by default.
 * @property {Boolean} isBusinessApprovalRequired Whether bookings to this service require approval.
 * @property {Boolean} requestsAffectsAvailability Whether the bookings requests affect the session or slot availability (e.g., 3 bookings requests for a 10-person session will cause this session to be displayed as having 7 available spots, before the requests are approved).
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~BusinessServicesPolicy
 * @summary Service policy.
 * @property {Number} bookUpToXMinutesBefore Latest amount of time that a participant can book before the start time of the booked item. In Session = the start time of the session, in schedule = the start time of the first session of a recurring session (excluding past sessions). Defaults to 0.
 * @property {Number} cancelRescheduleUpToXMinutesBefore Latest amount of time that a participant can cancel or reschedule the booking. Defaults to 0.
 * @property {wix-bookings-backend~FutureBookingPolicy} futureBookingsPolicy Advance booking policy - how far in advance a participant can book sessions, calculated from the current time.
 * @property {wix-bookings-backend~WaitingListPolicy} waitingListPolicy Waitlist policy for the service. Empty by default.
 */

/**
 * @typedef wix-bookings-backend~BookingPolicy
 * @summary Description of the bookings policy for this service.
 * @property {Number} bookUpToXMinutesBefore Latest amount of time that a participant can book before the start time of the booked item (When applied to a schedule this refers to the start time of the first upcoming session (excluding past sessions). Defaults to 0.
 * @property {Boolean} isBookOnlineAllowed Whether online booking is available. Defaults to true.
 * @property {wix-bookings-backend~WaitingListPolicy} waitingListPolicy Waitlist policy for the service. Empty by default.
 * @property {wix-bookings-backend~BookingsApprovalPolicy} bookingsApprovalPolicy Bookings approval policy for this service. Empty by default.
 * @property {Number} maxParticipantsPerBooking Max. number of participants per booking that can be specified when booking. Defaults to 1.
 * @property {Number} cancelRescheduleUpToXMinutesBefore Latest amount of time that a participant can cancel or reschedule the booking before the start time. Defaults to 0.
 * @property {Boolean} isRescheduleAllowed Whether bookings for this service can be rescheduled. Defaults to true.
 * @property {wix-bookings-backend~FutureBookingPolicy} futureBookingsPolicy Advance booking policy - how far in advance a participant can book sessions, calculated from the current time.
 * @property {Boolean} isCancelAllowed Whether bookings for this service can be canceled. Defaults to true.
 */

/**
 * @typedef wix-bookings-backend~AvailabilityConstraints
 * @summary Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 * @property {Array<Number>} slotDurations The optional durations of the available slots in minutes. Required. Minimum: 1.
Calculation of the available slots will generate slots with these durations if are not produce a conflict with the available intervals.
 * @property {Number} timeBetweenSlots The time between slots in minutes.
If a slot has already booked, then the start time of the next available slot will be calculated by the booked slot's end time plus the time_between_slots value.
Minimum: 0. Maximum: 120.
 * @property {Number} splitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
Optional. The default is the first duration in slot_durations field.
Deprecated. please use the split_slots_interval.value_in_minutes.
 * @property {wix-bookings-backend~SplitInterval} slotsSplitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00). (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~AddressFields
 * @summary Customer's address (displayed in Wix Bookings UI only when a service’s location is set to "Customer’s Place").
 * @property {wix-bookings-backend~FormField} street
 * @property {wix-bookings-backend~FormField} city
 * @property {wix-bookings-backend~FormField} floorNumber
 * @property {wix-bookings-backend~FormField} state
 */

/**
 * @typedef wix-bookings-backend~Frequency
 * @summary The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Number} repetition The frequency of the recurrence in weeks. i.e. when this value is 4, the interval occurs every 4 weeks. Optional. The default is 1. minimum: 1, maximum: 52.
 */

/**
 * @typedef wix-bookings-backend~CreateScheduleRequest
 * @summary schedule
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 */

/**
 * @typedef wix-bookings-backend~AdditionalLabel
 * @property {wix-bookings-backend~label} label
 */

/**
 * @typedef wix-bookings-backend~UpdateServiceResponse
 */

/**
 * @typedef wix-bookings-backend~Interval
 * @summary The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} daysOfWeek The day the interval accrue. Optional. The default is the day of the recurring interval's start time.
 * One of:
 *  + "UNDEFINED"
 *  + "MON"
 *  + "TUE"
 *  + "WED"
 *  + "THU"
 *  + "FRI"
 *  + "SAT"
 *  + "SUN"
 * @property {Number} hourOfDay The hour of the day the interval accrue. must be consistent with the Interval start time. Options. The default is 0. minimum: 0, maximum: 23.
 * @property {Number} minuteOfHour The minutes of hour the interval accrue. must be consistent with the Interval end time. Options. The default is 0. minimum: 0, maximum: 59.
 * @property {Number} duration The duration of the interval in minutes. Required. Part of the session end time calculation. minimum: 1, maximum: 86400.
 */

/**
 * @typedef wix-bookings-backend~FieldConstraints
 * @summary Constraints applied to this field.
 * @property {Boolean} required Whether customer's input in this field is required.
 */

/**
 * @typedef wix-bookings-backend~ParticipantNotification
 * @summary Whether to notify participants about the change and an optional custom message
 * @property {Boolean} notifyParticipants Whether to notify participants about the change
 * @property {String} message message to send to the participants, optional
 */

/**
 * @typedef wix-bookings-backend~GetFormRequest
 * @property {String} id The Id of the form to get
 */

/**
 * @typedef wix-bookings-backend~ActionLabels
 * @summary Available payment actions.
 * @property {String} offlinePaymentLabel Call to Action (CTA) text to display in Wix Bookings UI for in-person payment.
 * @property {String} onlinePaymentLabel Call to Action (CTA) text to display in Wix Bookings UI for online payment.
 * @property {String} bookingRequestApprovalLabel Call to Action (CTA) text to display in Wix Bookings UI for requesting booking approval.
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~CancelScheduleRequest
 * @property {Boolean} preserveFutureSessionsWithParticipants Whether to preserve future sessions with reservations. Defaults to false.
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification
 * @property {String} scheduleId Schedule ID.
 * @property {Date} from Time to cancel the sessions from. Optional. If this field is empty, all of this schedule's sessions will be canceled.
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @typedef wix-bookings-backend~CreateServiceRequest
 * @property {wix-bookings-backend~Service} service The service to be created.
 * @property {Array<wix-bookings-backend~Schedule>} schedules List of schedules to be assigned for that service. Currently only a single schedule is allowed.
 */

/**
 * @typedef wix-bookings-backend~SplitInterval
 * @summary Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
 * @property {Boolean} sameAsDuration Required. Indicates where the value for schedules split interval is specifies.
In case this field is true, the value will be the sum of the first duration in
schedule.availabilityConstraints.SlotDurations field and schedule.availabilityConstraints.TimeBetweenSlots field.
 * @property {Number} valueInMinutes Required in case the same_as_duration field is false.
Optional in case the same_as_duration field is true.
 */

/**
 * @typedef wix-bookings-backend~PaymentOptions
 * @summary Various payment options available for use when booking this service.
 * @property {Boolean} wixPayOnline Whether a booking made for this service can be paid online through Wix.
 * @property {Boolean} wixPayInPerson Whether a booking made for this service can be paid in person.
 * @property {Boolean} custom Whether a booking made for this service can be paid in a custom way which is up to the API user to define.
 * @property {Boolean} wixPaidPlan Whether a booking made for this service can be paid using Wix paid plans, e.g., memberships or packages.
 */

/**
 * @typedef wix-bookings-backend~RecurringInterval
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability. Can be calculated from the schedule or overridden on the recurring interval.
 * @property {wix-bookings-backend~Interval} interval The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} id The recurring interval identifier. (read-only, cannot be set in code)
 * @property {String} intervalType The type of recurring interval.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {Date} end The end time of the recurring interval. Optional. Empty value indicates that there is no end time.
 * @property {wix-bookings-backend~Frequency} frequency The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Date} start The start time of the recurring interval. Required.
 */

/**
 * @typedef wix-bookings-backend~label
 * @property {wix-bookings-backend~TextLabel} textLabel
 * @property {wix-bookings-backend~LinkLabel} linkLabel
 */

/**
 * @typedef wix-bookings-backend~Service
 * @summary The service to be created.
 * @property {String} categoryId ID of the category for which the service belongs
 * @property {wix-bookings-backend~PaymentOptions} paymentOptions Various payment options available for use when booking this service.
 * @property {Array<String>} scheduleIds List of schedules of the different sessions and slots which can be booked by visitors and owners for this service. Currently only one schedule is allowed. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ServiceInfo} info Information about the service.
 * @property {Object<String, String>} customProperties Set of key-value pairs.Set of custom properties that can be used to hold information in the context of a specific service.
 * @property {String} id Service ID. (read-only, cannot be set in code)
 * @property {String} status Status of the service.
 * One of:
 *  + "CREATED"
 *  + "DELETED"
 * (read-only, cannot be set in code)
 * @property {Number} sortOrder Sorting order of the service within its category.
 * @property {String} bookingFormId ID of the form that visitors will fill out when booking this service.
 * @property {wix-bookings-backend~BookingPolicy} policy Description of the bookings policy for this service.
 */

/**
 * @typedef wix-bookings-backend~ConferenceProvider
 * @summary Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {String} providerId Conferencing provider ID
 */

/**
 * @typedef wix-bookings-backend~FormField
 * @summary Customer's phone number.
 * @property {String} fieldId Field ID. (read-only, cannot be set in code)
 * @property {String} valueType
 * One of:
 *  + "SHORT_TEXT"
 *  + "LONG_TEXT"
 *  + "CHECK_BOX"
 * @property {String} label Field label.
 * @property {wix-bookings-backend~FieldConstraints} userConstraints Constraints applied to this field.
 * @property {Array<wix-bookings-backend~AdditionalLabel>} additionalLabels Additional labels applied to this field.
 */

/**
 * @typedef wix-bookings-backend~FieldMask
 * @summary Field mask of fields to update.
 * @property {Array<String>} paths The set of field mask paths.
 */

/**
 * @typedef wix-bookings-backend~Category
 * @property {String} name Category name.
 * @property {Object<String, String>} customProperties Set of key-value pairs.Custom properties that can be associated with the category.
 * @property {String} id Category ID. (read-only, cannot be set in code)
 * @property {String} status Category status (read-only).
 * One of:
 *  + "CREATED"
 *  + "DELETED"
 * (read-only, cannot be set in code)
 * @property {Number} sortOrder Sorting order of the category for Wix Bookings UI.
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~LinkLabel
 * @property {String} label Additional label applied to this URL-only field.
 * @property {String} url Returned URL.
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~Image
 * @property {String} id WixMedia image ID
 * @property {String} url URL of image
 * @property {Number} height Original image width
 * @property {Number} width Original image height
 */

/**
 * @typedef wix-bookings-backend~GetFormResponse
 * @property {wix-bookings-backend~Form} form The requested form
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~UpdateScheduleRequest
 * @property {wix-bookings-backend~FieldMask} fieldMask Field mask of fields to update.
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification.
 * @property {Boolean} alignTimeExceptions Optional. Defaults to false. In case of updated intervals' start time, this field indicates whether to align those interval's time exceptions.
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @typedef wix-bookings-backend~Schedule
 * @summary Schedule.
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {wix-bookings-backend~CalendarConference} calendarConference A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {Date} firstSessionStart The start time of the schedule. Read only. calculated by the start time of the first session. (read-only, cannot be set in code)
 * @property {String} scheduleOwnerId The id of the schedule's owner. e.g, in case of schedule of a service, service id.
 * @property {Array<wix-bookings-backend~RecurringInterval>} intervals Specifies the intervals for the sessions calculation. Optional. e.g. when creating class service you can add
pattern for recurring intervals, these intervals can be returned as schedule's sessions or available slots if
there are no other availability calculation constraints and the capacity is bigger then the current total number
of sessions' participants.
 * @property {Array<String>} tags Tags of the schedule. Optional. e.g., tag as service type. Google sessions tag as "Google".
This is the default tags of the schedule's sessions.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this schedule. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~Availability} availability Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} lastSessionEnd The end time of the schedule. Read only. calculated by the end time of the last session. (read-only, cannot be set in code)
 * @property {Number} version the schedule's version (read-only, cannot be set in code)
 * @property {String} id Schedule identifier.
 * @property {Date} updated The time when this schedule was last modified. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the business. (read-only, cannot be set in code)
 * @property {String} status The schedule's status. Optional.
Possible values are: CREATED, This is the default status. CANCELLED, the schedule was cancelled.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this schedule when this schedule is a bookable slot. Read only.
calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ConferenceProvider} conferenceProvider Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title The textual title of the schedule. Optional.
This is the default title of the schedule's sessions. i.e., a service name. Max length: 6000.
 * @property {String} timeZone The time zone of the schedule. Optional.
 * @property {Date} created The time when this schedule was created. (read-only, cannot be set in code)
 * @property {Number} capacity The maximum number of participants that can be added to this schedule's slots. Optional.
The default is 1. This is the default capacity of the schedule's sessions. minimum: 1, maximum: 1000
 */

/**
 * @typedef wix-bookings-backend~CalendarDateTime
 * @summary The start time of the session. Required.
 * @property {Date} timestamp The time in seconds of UTC time since Unix epoch. Optional.
Required if the localDateTime field is not specified.
If the local date time is given then this field will be ignored and will be calculated from
the local date time and the business timezone.
 * @property {wix-bookings-backend~LocalDateTime} localDateTime The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {String} timeZone The time zone. Optional.
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @summary Participant.
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Availability
 * @summary Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} start The time the schedule starts to be available for booking. Required.
 * @property {Date} end The time schedule stops to be available for booking. Optional. Empty value indicates that there is no end time.
 * @property {Array<wix-bookings-backend~LinkedSchedule>} linkedSchedules Reference to other schedules for availability calculations. Optional.
Supported only when there are no recurring intervals and with availability calculation constraints.
 * @property {wix-bookings-backend~AvailabilityConstraints} constraints Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 */

/**
 * @typedef wix-bookings-backend~Session
 * @summary Session.
 * @property {wix-bookings-backend~Rate} rate The price options offered to participate this session. Optional. The default value is the schedule rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {wix-bookings-backend~CalendarConference} calendarConference Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} scheduleOwnerId The schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 * @property {Array<String>} tags Tags of the session. Optional. The default value is the tags in the schedule.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this session. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability.
Can be calculated from the schedule intervals or overridden on the Session.
Currently supported only for 1 schedule.
 * @property {Date} originalStart The original start time of the session in the result. Optional.
 * @property {String} id Identifier for this session when session is a single session or generated from recurring interval. Optional. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the schedule. (read-only, cannot be set in code)
 * @property {String} recurringIntervalId Recurring interval id. Read only. Optional.
Specified when the session was originally generated from schedule recurring interval. (read-only, cannot be set in code)
 * @property {Number} timeReservedAfter Time reserved after session end time. Read only.
Derived from the schedule availability constraints time between slots.
 * @property {String} status Status of the session. Optional. Possible values are: CONFIRMED, this is the default value.
CANCELLED, if this session was generated from recurring interval and then got deleted, or if it was created as a single session and then was deleted.
 * One of:
 *  + "UNDEFINED"
 *  + "CONFIRMED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session. Read only.
Calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {String} scheduleId Schedule identifier. The schedule of the session. Required.
Session must be under specific schedule.
 * @property {wix-bookings-backend~CalendarDateTime} end The end time of the session. Required.
The end time must be after the start time and with the same calendar date time field.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} notes The note of the session. Indicating additional information about the session. Optional.
The default is empty notes.
 * @property {String} title The textual title of the session, i.e. A service name. Optional. The default value is the title in the schedule.
 * @property {String} type The type of the session.
Can be event or working hours session that represent available time of the schedule owner.
The default is event.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "WORKING_HOURS"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {wix-bookings-backend~CalendarDateTime} start The start time of the session. Required.
 * @property {Number} capacity The maximum number of participants that can be added to the session. Optional.
The default value is the capacity in the schedule.
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~AvailabilityConstraints
 * @summary Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 * @property {Array<Number>} slotDurations The optional durations of the available slots in minutes. Required. Minimum: 1.
Calculation of the available slots will generate slots with these durations if are not produce a conflict with the available intervals.
 * @property {Number} timeBetweenSlots The time between slots in minutes.
If a slot has already booked, then the start time of the next available slot will be calculated by the booked slot's end time plus the time_between_slots value.
Minimum: 0. Maximum: 120.
 * @property {Number} splitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
Optional. The default is the first duration in slot_durations field.
Deprecated. please use the split_slots_interval.value_in_minutes.
 * @property {wix-bookings-backend~SplitInterval} slotsSplitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00). (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Frequency
 * @summary The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Number} repetition The frequency of the recurrence in weeks. i.e. when this value is 4, the interval occurs every 4 weeks. Optional. The default is 1. minimum: 1, maximum: 52.
 */

/**
 * @typedef wix-bookings-backend~CreateScheduleRequest
 * @summary schedule
 * @property {wix-bookings-backend~Schedule} schedule Schedule.
 */

/**
 * @typedef wix-bookings-backend~Interval
 * @summary The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} daysOfWeek The day the interval accrue. Optional. The default is the day of the recurring interval's start time.
 * One of:
 *  + "UNDEFINED"
 *  + "MON"
 *  + "TUE"
 *  + "WED"
 *  + "THU"
 *  + "FRI"
 *  + "SAT"
 *  + "SUN"
 * @property {Number} hourOfDay The hour of the day the interval accrue. must be consistent with the Interval start time. Options. The default is 0. minimum: 0, maximum: 23.
 * @property {Number} minuteOfHour The minutes of hour the interval accrue. must be consistent with the Interval end time. Options. The default is 0. minimum: 0, maximum: 59.
 * @property {Number} duration The duration of the interval in minutes. Required. Part of the session end time calculation. minimum: 1, maximum: 86400.
 */

/**
 * @typedef wix-bookings-backend~ParticipantNotification
 * @summary Whether to notify participants about the change, and an optional custom message.
 * @property {Boolean} notifyParticipants Whether to notify participants about the change
 * @property {String} message message to send to the participants, optional
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~CancelScheduleRequest
 * @property {Boolean} preserveFutureSessionsWithParticipants Whether to preserve future sessions with reservations. Defaults to false.
 * @property {Boolean} notifyParticipants Deprecated, use participant_notification
 * @property {String} scheduleId Schedule ID.
 * @property {Date} from Time to cancel the sessions from. Optional. If this field is empty, all of this schedule's sessions will be canceled.
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change, and an optional custom message.
 */

/**
 * @typedef wix-bookings-backend~SplitInterval
 * @summary Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
 * @property {Boolean} sameAsDuration Required. Indicates where the value for schedules split interval is specifies.
In case this field is true, the value will be the sum of the first duration in
schedule.availabilityConstraints.SlotDurations field and schedule.availabilityConstraints.TimeBetweenSlots field.
 * @property {Number} valueInMinutes Required in case the same_as_duration field is false.
Optional in case the same_as_duration field is true.
 */

/**
 * @typedef wix-bookings-backend~RecurringInterval
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability. Can be calculated from the schedule or overridden on the recurring interval.
 * @property {wix-bookings-backend~Interval} interval The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} id The recurring interval identifier. (read-only, cannot be set in code)
 * @property {String} intervalType The type of recurring interval.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {Date} end The end time of the recurring interval. Optional. Empty value indicates that there is no end time.
 * @property {wix-bookings-backend~Frequency} frequency The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Date} start The start time of the recurring interval. Required.
 */

/**
 * @typedef wix-bookings-backend~ConferenceProvider
 * @summary Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {String} providerId Conferencing provider ID
 */

/**
 * @typedef wix-bookings-backend~LocalDateTime
 * @summary The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {Number} hourOfDay
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @property {Number} monthOfYear
 * @property {Number} minutesOfHour
 */

/**
 * @typedef wix-bookings-backend~FieldMask
 * @summary Session fields to revert to empty, in order to revert to the data inherited from the schedule.
 * @property {Array<String>} paths The set of field mask paths.
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~type
 * @property {wix-bookings-backend~SetOfSessions} setOfSessions
 * @property {wix-bookings-backend~SingleSession} singleSession
 */

/**
 * @typedef wix-bookings-backend~ContactDetails
 * @summary The contact details describing the owner of this booking.
 * @property {String} email Contact email. Mandatory field. used to create a new contact or get existing one from Contacts Service.
 * @property {String} lastName Contact last name.
 * @property {String} firstName Contact first name.
 * @property {String} countryCode Contact country of origin
 * @property {String} contactId Contact identifier used in Contact Service.  this field is read-only except in Book method.
 * @property {String} address Contact address.
 * @property {String} timeZone Contact time-zone.
 * @property {String} phone Contact phone.
 */

/**
 * @typedef wix-bookings-backend~WixPayDetails
 * @property {Date} orderApprovalTime
 * @property {String} orderId Cashier order Id
 * @property {String} orderAmount The order amount we issued to Cashier.
 * @property {String} orderStatus Transaction status
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "PENDING_MERCHANT"
 *  + "COMPLETE"
 *  + "FAILED"
 *  + "DECLINED"
 *  + "PENDING_MARK_AS_PAID"
 *  + "CANCELED"
 * @property {String} paymentVendorName Payment vendor name
 * @property {String} txId Cashier transaction Id
 */

/**
 * @typedef wix-bookings-backend~DeclineBookingResponse
 * @property {String} id
 */

/**
 * @typedef wix-bookings-backend~PaymentSelection
 * @property {String} rateLabel The label represent this booking rate, or free/custom if unspecified.
 * @property {Number} numberOfParticipants The number of participants register to this booking. Mandatory field.
 */

/**
 * @typedef wix-bookings-backend~CalendarDateTime
 * @summary The start time of the session. Required.
 * @property {Date} timestamp The time in seconds of UTC time since Unix epoch. Optional.
Required if the localDateTime field is not specified.
If the local date time is given then this field will be ignored and will be calculated from
the local date time and the business timezone.
 * @property {wix-bookings-backend~LocalDateTime} localDateTime The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {String} timeZone The time zone. Optional.
 */

/**
 * @typedef wix-bookings-backend~Value
 * @property {wix-bookings-backend~kind} kind The kind of value.
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~Sorting
 * @property {String} fieldName Name of the field to sort by
 * @property {String} order Sort order (ASC/DESC). Defaults to ASC
 * One of:
 *  + "ASC"
 *  + "DESC"
 */

/**
 * @typedef wix-bookings-backend~ListByContactsResponse
 * @property {Array<wix-bookings-backend~ListBookingEntry>} bookingsEntries
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~CustomFormField
 * @property {String} id The id of the form field as defined in the form entity
 * @property {String} value Value that was submitted per this field
 * @property {String} label Snapshot of the form field label during form submission. (read-only, cannot be set in code)
 * @property {String} valueType
 * One of:
 *  + "SHORT_TEXT"
 *  + "LONG_TEXT"
 *  + "CHECK_BOX"
 */

/**
 * @typedef wix-bookings-backend~BookedEntity
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this session at the time of booking.
 * @property {wix-bookings-backend~Location} location Geographic location of the session.
 * @property {Array<String>} tags
 * @property {String} scheduleId
 * @property {String} title Session title at the time of booking.
 * @property {wix-bookings-backend~type} type
 * @property {String} serviceId
 * @property {wix-bookings-backend~OnlineConference} onlineConference Online conference information
 */

/**
 * @typedef wix-bookings-backend~Paging
 * @summary Limit number of results
 * @property {Number} limit The number of items to load
 * @property {Number} offset number of items to skip in the current sort order
 */

/**
 * @typedef wix-bookings-backend~ListByContactsRequest
 * @property {Array<String>} contactIds
 * @property {wix-bookings-backend~Query} query
 * @property {Boolean} withBookingAllowedActions If true will return also the allowed actions for this Booking, for example, if Cancel is allowed for this Booking.
 */

/**
 * @typedef wix-bookings-backend~Session
 * @summary Session to create and book.
 * @property {wix-bookings-backend~Rate} rate The price options offered to participate this session. Optional. The default value is the schedule rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {wix-bookings-backend~CalendarConference} calendarConference Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} scheduleOwnerId The schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 * @property {Array<String>} tags Tags of the session. Optional. The default value is the tags in the schedule.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this session. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability.
Can be calculated from the schedule intervals or overridden on the Session.
Currently supported only for 1 schedule.
 * @property {Date} originalStart The original start time of the session in the result. Optional.
 * @property {String} id Identifier for this session when session is a single session or generated from recurring interval. Optional. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the schedule. (read-only, cannot be set in code)
 * @property {String} recurringIntervalId Recurring interval id. Read only. Optional.
Specified when the session was originally generated from schedule recurring interval. (read-only, cannot be set in code)
 * @property {Number} timeReservedAfter Time reserved after session end time. Read only.
Derived from the schedule availability constraints time between slots.
 * @property {String} status Status of the session. Optional. Possible values are: CONFIRMED, this is the default value.
CANCELLED, if this session was generated from recurring interval and then got deleted, or if it was created as a single session and then was deleted.
 * One of:
 *  + "UNDEFINED"
 *  + "CONFIRMED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session. Read only.
Calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {String} scheduleId Schedule identifier. The schedule of the session. Required.
Session must be under specific schedule.
 * @property {wix-bookings-backend~CalendarDateTime} end The end time of the session. Required.
The end time must be after the start time and with the same calendar date time field.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} notes The note of the session. Indicating additional information about the session. Optional.
The default is empty notes.
 * @property {String} title The textual title of the session, i.e. A service name. Optional. The default value is the title in the schedule.
 * @property {String} type The type of the session.
Can be event or working hours session that represent available time of the schedule owner.
The default is event.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "WORKING_HOURS"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {wix-bookings-backend~CalendarDateTime} start The start time of the session. Required.
 * @property {Number} capacity The maximum number of participants that can be added to the session. Optional.
The default value is the capacity in the schedule.
 */

/**
 * @typedef wix-bookings-backend~Query
 * @property {Array<String>} fieldsets Projection on the result object - list of named projections. E.g. "basic" will return id and name fields. Specifying multiple fieldsets will return the union of fields from all. Specifying fieldsets and fields will also return the union of fields.
 * @property {wix-bookings-backend~Value} filter A filter object. See documentation [here](https://bo.wix.com/wix-docs/rnd/platformization-guidelines/api-query-language#platformization-guidelines_api-query-language_defining-in-protobuf)
 * @property {wix-bookings-backend~Paging} paging Limit number of results
 * @property {Array<String>} fields Projection on the result object - list of specific field names to return. If fieldsets are also specified, return the union of fieldsets and fields
 * @property {Array<wix-bookings-backend~Sorting>} sort Sort object in the form [{"fieldName":"sortField1"},{"fieldName":"sortField2","direction":"DESC"}]
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~OnlineConference
 * @summary Online conference information
 * @property {String} guestUrl participant url
 * @property {String} providerId online conference provider identifier
 * @property {String} password online conference password
 */

/**
 * @typedef wix-bookings-backend~DeclineBookingRequest
 * @property {String} id the Booking id to decline
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 */

/**
 * @typedef wix-bookings-backend~PaidPlanDetails
 * @summary Paid plan details used to pay for the booking.
 * @property {Number} currentCredit
 * @property {String} planName Plan name
 * @property {Number} originalCredit
 * @property {wix-bookings-backend~PaidPlan} plan Plan details
 * @property {String} transactionId Transaction id created in Paid Plans Benefit service.
 */

/**
 * @typedef wix-bookings-backend~SingleSession
 * @property {String} sessionId
 * @property {Date} start The start time of the session.
 * @property {Date} end The end time of the session.
 */

/**
 * @typedef wix-bookings-backend~FormInfo
 * @summary Form info submitted when booking. Contains contact details, participants, other form fields specified by the owner for the choosen service.
 Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~ContactDetails} contactDetails The contact details describing the owner of this booking.
 * @property {Array<wix-bookings-backend~PaymentSelection>} paymentSelection
 * @property {Object<String, String>} customFormFields Set of key-value pairs. Other custom field values that were specified by the user. In the form of field_id to value mapping.
 Deprecated. Is being replaced with additional_fields.
 * @property {Array<wix-bookings-backend~CustomFormField>} additionalFields Additional custom fields submitted with the form.
 */

/**
 * @typedef wix-bookings-backend~ParticipantNotification
 * @summary Whether to notify participants about the change and an optional custom message
 * @property {Boolean} notifyParticipants Whether to notify participants about the change
 * @property {String} message message to send to the participants, optional
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~PaidPlan
 * @summary Plan details
 * @property {String} orderId
 * @property {String} benefitId
 * @property {String} planId
 */

/**
 * @typedef wix-bookings-backend~UpdateBookingResponse
 * @property {wix-bookings-backend~Booking} booking
 */

/**
 * @typedef wix-bookings-backend~AllowedActions
 * @summary Optional. Will return only when requested.
 * @property {Boolean} cancel Is cancel booking allowed
 * @property {Boolean} reschedule Is reschedule booking allowed
 * @property {Boolean} bookAnother Is it possible to book another booking to the same service.
 */

/**
 * @typedef wix-bookings-backend~BookedResource
 * @property {String} id
 * @property {String} name Resource's name at the time of booking
 * @property {String} email Resource's email at the time of booking. Optional.
 */

/**
 * @typedef wix-bookings-backend~AttendanceInfo
 * @summary Attendance Info. Optional
 * @property {Boolean} attendanceStatus Indicated whether the booked contact attended the session
 * @property {Number} numberOfAttendees The number of attendees that attended. Can be more than 1 if the booking was with accompanied party
 */

/**
 * @typedef wix-bookings-backend~ListBookingEntry
 * @property {wix-bookings-backend~Booking} booking
 * @property {wix-bookings-backend~AllowedActions} allowedActions Optional. Will return only when requested.
 */

/**
 * @typedef wix-bookings-backend~BookingSource
 * @property {String} platform The platform from which a booking was created
 * One of:
 *  + "UNDEFINED_PLATFORM"
 *  + "WEB"
 *  + "MOBILE_APP"
 * @property {String} actor The actor that created this booking
 * One of:
 *  + "UNDEFINED_ACTOR"
 *  + "BUSINESS"
 *  + "CUSTOMER"
 * @property {String} appDefId The appDefId of the application that created this booking (read-only, cannot be set in code)
 * @property {String} appName The name of the application that created this booking, as saved in Wix-dev-center at the time of booking (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~ConfirmBookingResponse
 * @property {String} id the Booking id that confirmed
 */

/**
 * @typedef wix-bookings-backend~ConfirmBookingRequest
 * @property {String} id the Booking id to confirm
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 */

/**
 * @typedef wix-bookings-backend~SetOfSessions
 * @property {Date} firstSessionStart The start time of the first session.
 * @property {Date} lastSessionEnd The end time of the last session.
 */

/**
 * @typedef wix-bookings-backend~LocalDateTime
 * @summary The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {Number} hourOfDay
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @property {Number} monthOfYear
 * @property {Number} minutesOfHour
 */

/**
 * @typedef wix-bookings-backend~FieldMask
 * @summary Which fields to be included in this update. Currently only one field at a time is allowed.
 * @property {Array<String>} paths The set of field mask paths.
 */

/**
 * @typedef wix-bookings-backend~PaymentDetails
 * @summary Payment Details. Optional. On Create, in case of a given empty field, this booking will not be send to checkout for payment.
 * @property {String} state Checkout current state.
 * One of:
 *  + "UNDEFINED"
 *  + "COMPLETE"
 *  + "PENDING_CASHIER"
 *  + "REJECTED"
 *  + "READY"
 *  + "CANCELED"
 *  + "REFUNDED"
 *  + "PENDING_MERCHANT"
 *  + "WIX_PAY_FAILURE"
 *  + "PENDING_MARK_AS_PAID"
 *  + "PENDING_BUYER"
 * @property {wix-bookings-backend~WixPayDetails} wixPayDetails [DEPRECATED]. USE wix_pay_multiple_details.
 * @property {wix-bookings-backend~PaidPlanDetails} paidPlanDetails Paid plan details used to pay for the booking.
 * @property {wix-bookings-backend~Balance} balance The booking Balance.
 * @property {String} id Checkout identifier.
 * @property {Array<wix-bookings-backend~WixPayDetails>} wixPayMultipleDetails In case of wix-pay service, holds all payment history for a booking.
 * @property {wix-bookings-backend~CouponDetails} couponDetails temporarily in-out , when available indicate coupon usage.
 */

/**
 * @typedef wix-bookings-backend~reschedule
 * @summary In case of rescheduling the booking, the new scheduling item to which the booking was rescheduled
 * @property {wix-bookings-backend~Session} createSession Reschedule to a new session that. This will create the session.
 * @property {wix-bookings-backend~BySessionId} bySessionId Reschedule to an existing session with start & end dates for validation
 * @property {String} scheduleId Reschedule to an existing schedule
 * @property {String} sessionId Reschedule to an existing session
 */

/**
 * @typedef wix-bookings-backend~Booking
 * @property {Array<wix-bookings-backend~BookedResource>} bookedResources
 * @property {wix-bookings-backend~FormInfo} formInfo Form info submitted when booking. Contains contact details, participants, other form fields specified by the owner for the choosen service.
 Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~BookingSource} bookingSource
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails Payment Details. Optional. On Create, in case of a given empty field, this booking will not be send to checkout for payment.
 * @property {String} id
 * @property {String} externalUserId External Id provided by the client on creation
 * @property {String} status
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING_CHECKOUT"
 *  + "CONFIRMED"
 *  + "CANCELED"
 *  + "PENDING"
 *  + "PENDING_APPROVAL"
 *  + "DECLINED"
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 * @property {wix-bookings-backend~AttendanceInfo} attendanceInfo Attendance Info. Optional
 * @property {Date} created Created timestamp. Read-only.
 */

/**
 * @typedef wix-bookings-backend~BySessionId
 * @summary Session Id to book.
 * @property {String} sessionId The requested session id to book.
 * @property {wix-bookings-backend~LocalDateTime} start The session start time. Used to validate the Business and Client timezone differences.
 * @property {wix-bookings-backend~LocalDateTime} end The session end time. Used to validate the Business and Client timezone differences.
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~UpdateBookingRequest
 * @property {wix-bookings-backend~FormInfo} formInfo Update the form information, including the contact details describing the owner of this booking.
 * @property {wix-bookings-backend~FieldMask} fieldMask Which fields to be included in this update. Currently only one field at a time is allowed.
 * @property {Boolean} notifyParticipants Should notify participants - for now, relevant only on reschedule
 deprecated, use participant_notification
 * @property {String} id Id of the Booking to be updated
 * @property {wix-bookings-backend~reschedule} reschedule In case of rescheduling the booking, the new scheduling item to which the booking was rescheduled
 * @property {String} status
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING_CHECKOUT"
 *  + "CONFIRMED"
 *  + "CANCELED"
 *  + "PENDING"
 *  + "PENDING_APPROVAL"
 *  + "DECLINED"
 * @property {String} updateAmountReceived Update the amount received
 * @property {wix-bookings-backend~ParticipantNotification} participantNotification Whether to notify participants about the change and an optional custom message
 * @property {wix-bookings-backend~AttendanceInfo} attendanceInfo Update the attendance information for this booking
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this session at the time of booking.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~kind
 * @summary The kind of value.
 * @property {String} nullValue Represents a null value.
 * One of:
 *  + "NULL_VALUE"
 * @property {Boolean} boolValue Represents a boolean value.
 * @property {Number} numberValue Represents a double value.
 * @property {String} stringValue Represents a string value.
 * @property {Array<wix-bookings-backend~Value>} listValue Represents a repeated `Value`.
 * @property {Object} structValue Represents a structured value.
 */

/**
 * @typedef wix-bookings-backend~Balance
 * @summary The booking Balance.
 * @property {wix-bookings-backend~Price} finalPrice The final calculated price.
 Calculated using the service price multiplied by the booking's number of participants deducted any discount (coupons, etc.)
 * @property {String} amountReceived Amount paid.
 */

/**
 * @typedef wix-bookings-backend~CouponDetails
 * @summary temporarily in-out , when available indicate coupon usage.
 * @property {String} couponName
 * @property {String} couponCode
 * @property {String} couponDiscount
 * @property {String} couponId
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~CalendarDateTime
 * @summary The start time of the session. Required.
 * @property {Date} timestamp The time in seconds of UTC time since Unix epoch. Optional.
Required if the localDateTime field is not specified.
If the local date time is given then this field will be ignored and will be calculated from
the local date time and the business timezone.
 * @property {wix-bookings-backend~LocalDateTime} localDateTime The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {String} timeZone The time zone. Optional.
 */

/**
 * @typedef wix-bookings-backend~Value
 * @property {wix-bookings-backend~kind} kind The kind of value.
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~Sorting
 * @property {String} fieldName Name of the field to sort by
 * @property {String} order Sort order (ASC/DESC). Defaults to ASC
 * One of:
 *  + "ASC"
 *  + "DESC"
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Paging
 * @summary Limit number of results
 * @property {Number} limit The number of items to load
 * @property {Number} offset number of items to skip in the current sort order
 */

/**
 * @typedef wix-bookings-backend~Session
 * @property {wix-bookings-backend~Rate} rate The price options offered to participate this session. Optional. The default value is the schedule rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {wix-bookings-backend~CalendarConference} calendarConference Holding the conference meeting created when the session is created, according to the details set in the Schedule's conference provider information.
 * @property {String} scheduleOwnerId The schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 * @property {Array<String>} tags Tags of the session. Optional. The default value is the tags in the schedule.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this session. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability.
Can be calculated from the schedule intervals or overridden on the Session.
Currently supported only for 1 schedule.
 * @property {Date} originalStart The original start time of the session in the result. Optional.
 * @property {String} id Identifier for this session when session is a single session or generated from recurring interval. Optional. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the schedule. (read-only, cannot be set in code)
 * @property {String} recurringIntervalId Recurring interval id. Read only. Optional.
Specified when the session was originally generated from schedule recurring interval. (read-only, cannot be set in code)
 * @property {Number} timeReservedAfter Time reserved after session end time. Read only.
Derived from the schedule availability constraints time between slots.
 * @property {String} status Status of the session. Optional. Possible values are: CONFIRMED, this is the default value.
CANCELLED, if this session was generated from recurring interval and then got deleted, or if it was created as a single session and then was deleted.
 * One of:
 *  + "UNDEFINED"
 *  + "CONFIRMED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this session. Read only.
Calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {String} scheduleId Schedule identifier. The schedule of the session. Required.
Session must be under specific schedule.
 * @property {wix-bookings-backend~CalendarDateTime} end The end time of the session. Required.
The end time must be after the start time and with the same calendar date time field.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} notes The note of the session. Indicating additional information about the session. Optional.
The default is empty notes.
 * @property {String} title The textual title of the session, i.e. A service name. Optional. The default value is the title in the schedule.
 * @property {String} type The type of the session.
Can be event or working hours session that represent available time of the schedule owner.
The default is event.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "WORKING_HOURS"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {wix-bookings-backend~CalendarDateTime} start The start time of the session. Required.
 * @property {Number} capacity The maximum number of participants that can be added to the session. Optional.
The default value is the capacity in the schedule.
 */

/**
 * @typedef wix-bookings-backend~Query
 * @summary Partially supported. See description above.
 * @property {Array<String>} fieldsets Projection on the result object - list of named projections. E.g. "basic" will return id and name fields. Specifying multiple fieldsets will return the union of fields from all. Specifying fieldsets and fields will also return the union of fields.
 * @property {wix-bookings-backend~Value} filter A filter object. See documentation [here](https://bo.wix.com/wix-docs/rnd/platformization-guidelines/api-query-language#platformization-guidelines_api-query-language_defining-in-protobuf)
 * @property {wix-bookings-backend~Paging} paging Limit number of results
 * @property {Array<String>} fields Projection on the result object - list of specific field names to return. If fieldsets are also specified, return the union of fieldsets and fields
 * @property {Array<wix-bookings-backend~Sorting>} sort Sort object in the form [{"fieldName":"sortField1"},{"fieldName":"sortField2","direction":"DESC"}]
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional. When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation. The default is the schedule external calendar overrides.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session as free-form text. Optional.
The default value is the location in the schedule.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~LocalDateTime
 * @summary The time in local date time. Optional.
If the this field is specified then the timestamp will be ignored and will be calculated from
this local date time and the business timezone.
 * @property {Number} hourOfDay
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @property {Number} monthOfYear
 * @property {Number} minutesOfHour
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to participate this session. Optional. The default value is the schedule rate.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~kind
 * @summary The kind of value.
 * @property {String} nullValue Represents a null value.
 * One of:
 *  + "NULL_VALUE"
 * @property {Boolean} boolValue Represents a boolean value.
 * @property {Number} numberValue Represents a double value.
 * @property {String} stringValue Represents a string value.
 * @property {Array<wix-bookings-backend~Value>} listValue Represents a repeated `Value`.
 * @property {Object} structValue Represents a structured value.
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~Schedule
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {wix-bookings-backend~CalendarConference} calendarConference A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {Date} firstSessionStart The start time of the schedule. Read only. calculated by the start time of the first session. (read-only, cannot be set in code)
 * @property {String} scheduleOwnerId The id of the schedule's owner. e.g, in case of schedule of a service, service id.
 * @property {Array<wix-bookings-backend~RecurringInterval>} intervals Specifies the intervals for the sessions calculation. Optional. e.g. when creating class service you can add
pattern for recurring intervals, these intervals can be returned as schedule's sessions or available slots if
there are no other availability calculation constraints and the capacity is bigger then the current total number
of sessions' participants.
 * @property {Array<String>} tags Tags of the schedule. Optional. e.g., tag as service type. Google sessions tag as "Google".
This is the default tags of the schedule's sessions.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this schedule. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~Availability} availability Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} lastSessionEnd The end time of the schedule. Read only. calculated by the end time of the last session. (read-only, cannot be set in code)
 * @property {Number} version the schedule's version (read-only, cannot be set in code)
 * @property {String} id Schedule identifier.
 * @property {Date} updated The time when this schedule was last modified. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the business. (read-only, cannot be set in code)
 * @property {String} status The schedule's status. Optional.
Possible values are: CREATED, This is the default status. CANCELLED, the schedule was cancelled.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this schedule when this schedule is a bookable slot. Read only.
calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ConferenceProvider} conferenceProvider Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title The textual title of the schedule. Optional.
This is the default title of the schedule's sessions. i.e., a service name. Max length: 6000.
 * @property {String} timeZone The time zone of the schedule. Optional.
 * @property {Date} created The time when this schedule was created. (read-only, cannot be set in code)
 * @property {Number} capacity The maximum number of participants that can be added to this schedule's slots. Optional.
The default is 1. This is the default capacity of the schedule's sessions. minimum: 1, maximum: 1000
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Resource
 * @property {String} name Resource's name. Required.
 * @property {String} email Resource's email address.
 * @property {String} description Resource description.
 * @property {String} tag Deprecated - use tags instead.
 * @property {Array<String>} tags Resource tags, can be used to tag a resource and later filter resources by these tags.
 * @property {Array<wix-bookings-backend~Schedule>} schedules List of schedules owned by the resources. Required.
 * @property {String} id Resource's unique ID (read-only, cannot be set in code)
 * @property {String} status Resource's status. Read only. Default is CREATED.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "DELETED"
 *  + "UPDATED"
 * (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~Image>} images Resource's images.
 * @property {String} phone Resource's phone number.
 */

/**
 * @typedef wix-bookings-backend~Availability
 * @summary Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} start The time the schedule starts to be available for booking. Required.
 * @property {Date} end The time schedule stops to be available for booking. Optional. Empty value indicates that there is no end time.
 * @property {Array<wix-bookings-backend~LinkedSchedule>} linkedSchedules Reference to other schedules for availability calculations. Optional.
Supported only when there are no recurring intervals and with availability calculation constraints.
 * @property {wix-bookings-backend~AvailabilityConstraints} constraints Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~AvailabilityConstraints
 * @summary Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 * @property {Array<Number>} slotDurations The optional durations of the available slots in minutes. Required. Minimum: 1.
Calculation of the available slots will generate slots with these durations if are not produce a conflict with the available intervals.
 * @property {Number} timeBetweenSlots The time between slots in minutes.
If a slot has already booked, then the start time of the next available slot will be calculated by the booked slot's end time plus the time_between_slots value.
Minimum: 0. Maximum: 120.
 * @property {Number} splitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
Optional. The default is the first duration in slot_durations field.
Deprecated. please use the split_slots_interval.value_in_minutes.
 * @property {wix-bookings-backend~SplitInterval} slotsSplitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00). (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Frequency
 * @summary The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Number} repetition The frequency of the recurrence in weeks. i.e. when this value is 4, the interval occurs every 4 weeks. Optional. The default is 1. minimum: 1, maximum: 52.
 */

/**
 * @typedef wix-bookings-backend~Interval
 * @summary The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} daysOfWeek The day the interval accrue. Optional. The default is the day of the recurring interval's start time.
 * One of:
 *  + "UNDEFINED"
 *  + "MON"
 *  + "TUE"
 *  + "WED"
 *  + "THU"
 *  + "FRI"
 *  + "SAT"
 *  + "SUN"
 * @property {Number} hourOfDay The hour of the day the interval accrue. must be consistent with the Interval start time. Options. The default is 0. minimum: 0, maximum: 23.
 * @property {Number} minuteOfHour The minutes of hour the interval accrue. must be consistent with the Interval end time. Options. The default is 0. minimum: 0, maximum: 59.
 * @property {Number} duration The duration of the interval in minutes. Required. Part of the session end time calculation. minimum: 1, maximum: 86400.
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~SplitInterval
 * @summary Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
 * @property {Boolean} sameAsDuration Required. Indicates where the value for schedules split interval is specifies.
In case this field is true, the value will be the sum of the first duration in
schedule.availabilityConstraints.SlotDurations field and schedule.availabilityConstraints.TimeBetweenSlots field.
 * @property {Number} valueInMinutes Required in case the same_as_duration field is false.
Optional in case the same_as_duration field is true.
 */

/**
 * @typedef wix-bookings-backend~RecurringInterval
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability. Can be calculated from the schedule or overridden on the recurring interval.
 * @property {wix-bookings-backend~Interval} interval The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} id The recurring interval identifier. (read-only, cannot be set in code)
 * @property {String} intervalType The type of recurring interval.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {Date} end The end time of the recurring interval. Optional. Empty value indicates that there is no end time.
 * @property {wix-bookings-backend~Frequency} frequency The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Date} start The start time of the recurring interval. Required.
 */

/**
 * @typedef wix-bookings-backend~ConferenceProvider
 * @summary Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {String} providerId Conferencing provider ID
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~Image
 * @property {String} id WixMedia image ID
 * @property {String} url URL of image
 * @property {Number} height Original image width
 * @property {Number} width Original image height
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~WaitingListPolicy
 * @summary Waitlist policy for the service. Empty by default.
 * @property {Boolean} isEnabled Whether waitlisting is enabled for the service.
 * @property {Number} capacity Number of spots available in waitlist. Defaults to 10 spots.
 * @property {Number} timeWindowMinutes Amount of time each participant is given to book once notified that a spot is available. Defaults to 10 minutes.
 */

/**
 * @typedef wix-bookings-backend~Form
 * @summary Booking form used to get the customer's input while booking the service.
 * @property {wix-bookings-backend~FormField} numberOfParticipants Number of participants being booked to the service (displayed in Wix Bookings UI only for services that allow booking multiple people per booking).
 * @property {wix-bookings-backend~FormField} name Customer's name.
 * @property {wix-bookings-backend~FormField} email Customer's email address.
 * @property {Array<wix-bookings-backend~FormField>} customFields Custom fields which can be added to the form.
 * @property {wix-bookings-backend~ActionLabels} actionLabels Available payment actions.
 * @property {String} id Form ID. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~AddressFields} address Customer's address (displayed in Wix Bookings UI only when a service’s location is set to "Customer’s Place").
 * @property {wix-bookings-backend~Header} header Form header
 * @property {wix-bookings-backend~FormField} phone Customer's phone number.
 */

/**
 * @typedef wix-bookings-backend~GetServiceResponse
 * @summary A full catalog detailed response containing all the information related to a service.
 * @property {Array<wix-bookings-backend~PricingPlan>} pricingPlans All available pricing plans that can be used to book this service.
 * @property {wix-bookings-backend~URLs} urls URLs to directly access the service's information page, and the service's booking page in Wix Bookings.
 * @property {Array<wix-bookings-backend~Schedule>} schedules Full schedule details of the service.
 * @property {wix-bookings-backend~Service} service The service entity
 * @property {String} status Bookings service status.
 * One of:
 *  + "ACTIVE"
 *  + "DELETED"
 * @property {Array<wix-bookings-backend~Resource>} resources Resources associated with this service (e.g., the staff member teaching a class).
 * @property {wix-bookings-backend~Category} category Category associated with the service.
 * @property {wix-bookings-backend~Form} form Booking form used to get the customer's input while booking the service.
 * @property {Array<wix-bookings-backend~Slug>} slugs Slug of the service. This combined with the URL provides the full path to the service's page and booking page.
 */

/**
 * @typedef wix-bookings-backend~Schedule
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {wix-bookings-backend~Location} location Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {wix-bookings-backend~CalendarConference} calendarConference A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {Date} firstSessionStart The start time of the schedule. Read only. calculated by the start time of the first session. (read-only, cannot be set in code)
 * @property {String} scheduleOwnerId The id of the schedule's owner. e.g, in case of schedule of a service, service id.
 * @property {Array<wix-bookings-backend~RecurringInterval>} intervals Specifies the intervals for the sessions calculation. Optional. e.g. when creating class service you can add
pattern for recurring intervals, these intervals can be returned as schedule's sessions or available slots if
there are no other availability calculation constraints and the capacity is bigger then the current total number
of sessions' participants.
 * @property {Array<String>} tags Tags of the schedule. Optional. e.g., tag as service type. Google sessions tag as "Google".
This is the default tags of the schedule's sessions.
 * @property {Array<wix-bookings-backend~Participant>} participants The registered participants of this schedule. Read only.
Can be added using Schedules service using the Participants apis. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~Availability} availability Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} lastSessionEnd The end time of the schedule. Read only. calculated by the end time of the last session. (read-only, cannot be set in code)
 * @property {Number} version the schedule's version (read-only, cannot be set in code)
 * @property {String} id Schedule identifier.
 * @property {Date} updated The time when this schedule was last modified. (read-only, cannot be set in code)
 * @property {Array<String>} inheritedFields A list of fields for which values were inherited from the business. (read-only, cannot be set in code)
 * @property {String} status The schedule's status. Optional.
Possible values are: CREATED, This is the default status. CANCELLED, the schedule was cancelled.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "CANCELLED"
 * (read-only, cannot be set in code)
 * @property {Number} totalNumberOfParticipants The current number of registered participants on this schedule when this schedule is a bookable slot. Read only.
calculated by the number of participants plus the additional participants. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ConferenceProvider} conferenceProvider Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {wix-bookings-backend~ExternalCalendarOverrides} externalCalendarOverrides Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title The textual title of the schedule. Optional.
This is the default title of the schedule's sessions. i.e., a service name. Max length: 6000.
 * @property {String} timeZone The time zone of the schedule. Optional.
 * @property {Date} created The time when this schedule was created. (read-only, cannot be set in code)
 * @property {Number} capacity The maximum number of participants that can be added to this schedule's slots. Optional.
The default is 1. This is the default capacity of the schedule's sessions. minimum: 1, maximum: 1000
 */

/**
 * @typedef wix-bookings-backend~PageUrl
 * @summary The URL for the booking entry point. It can be either to the calendar or to the service page.
 * @property {String} base The base URL. For premium sites, this will be the domain. For free sites, this would be site URL (e.g mysite.wixsite.com/mysite)
 * @property {String} path The path to that page - e.g /product-page/a-product
 */

/**
 * @typedef wix-bookings-backend~GetResourceResponse
 * @property {wix-bookings-backend~Resource} resource
 * @property {Array<wix-bookings-backend~Slug>} slugs
 */

/**
 * @typedef wix-bookings-backend~Value
 * @property {wix-bookings-backend~kind} kind The kind of value.
 */

/**
 * @typedef wix-bookings-backend~URLs
 * @summary URLs to directly access the service's information page, and the service's booking page in Wix Bookings.
 * @property {wix-bookings-backend~PageUrl} servicePageUrl The URL for the service page
 * @property {wix-bookings-backend~PageUrl} bookingPageUrl The URL for the booking entry point. It can be either to the calendar or to the service page.
 */

/**
 * @typedef wix-bookings-backend~CalendarConference
 * @summary A conference meeting created for the schedule. This is used when a participant is added to a schedule.
 * @property {String} externalId The conference meeting ID in the provider's conferencing system
 * @property {String} hostUrl URL used by the host to start the conference meeting
 * @property {String} providerId The provider Id
 * @property {String} id The conference meeting ID (In WiX Calendar)
 * @property {String} guestUrl URL used by a guest to join the conference meeting
 * @property {String} password Password to join the conference.
 */

/**
 * @typedef wix-bookings-backend~ServiceInfo
 * @summary Information about the service.
 * @property {String} name Service name.
 * @property {String} description Service description.
 * @property {Array<wix-bookings-backend~Image>} images Images associated with this service.
 * @property {String} tagLine Service description - short version.
 */

/**
 * @typedef wix-bookings-backend~Sorting
 * @property {String} fieldName Name of the field to sort by
 * @property {String} order Sort order (ASC/DESC). Defaults to ASC
 * One of:
 *  + "ASC"
 *  + "DESC"
 */

/**
 * @typedef wix-bookings-backend~Property
 * @property {String} propertyName The name of the property. Required.
 * @property {String} value The value of the property. Optional.
 */

/**
 * @typedef wix-bookings-backend~Participant
 * @property {String} name Name of the registered participant (optional).
 * @property {String} email Email address of the contact (optional).
 * @property {String} id Reservation ID. Required.
 * @property {String} contactId Contact ID (optional).
 * @property {Number} partySize Party size (optional). Defaults to 0. Min value is 0, max value is 250.
 * @property {String} approvalStatus Approval status for the participant. Defaults to UNDEFINED.
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING"
 *  + "APPROVED"
 *  + "DECLINED"
 * @property {String} phone Phone number of the contact (optional).
 */

/**
 * @typedef wix-bookings-backend~Resource
 * @property {String} name Resource's name. Required.
 * @property {String} email Resource's email address.
 * @property {String} description Resource description.
 * @property {String} tag Deprecated - use tags instead.
 * @property {Array<String>} tags Resource tags, can be used to tag a resource and later filter resources by these tags.
 * @property {Array<wix-bookings-backend~Schedule>} schedules List of schedules owned by the resources. Required.
 * @property {String} id Resource's unique ID (read-only, cannot be set in code)
 * @property {String} status Resource's status. Read only. Default is CREATED.
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "DELETED"
 *  + "UPDATED"
 * (read-only, cannot be set in code)
 * @property {Array<wix-bookings-backend~Image>} images Resource's images.
 * @property {String} phone Resource's phone number.
 */

/**
 * @typedef wix-bookings-backend~ListResourcesResponse
 * @property {Array<wix-bookings-backend~GetResourceResponse>} resources
 * @property {wix-bookings-backend~QueryMetaData} metadata
 */

/**
 * @typedef wix-bookings-backend~Availability
 * @summary Describes how to calculate the schedule's availability for adding participants. Optional.
Empty value indicates that this schedule is not available for adding participants.
This definition will be applied to the schedule's available intervals. Schedule's available intervals are the
recurring intervals minus sessions that has no more spots, or schedule's sessions with open spots.
 * @property {Date} start The time the schedule starts to be available for booking. Required.
 * @property {Date} end The time schedule stops to be available for booking. Optional. Empty value indicates that there is no end time.
 * @property {Array<wix-bookings-backend~LinkedSchedule>} linkedSchedules Reference to other schedules for availability calculations. Optional.
Supported only when there are no recurring intervals and with availability calculation constraints.
 * @property {wix-bookings-backend~AvailabilityConstraints} constraints Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 */

/**
 * @typedef wix-bookings-backend~GetActiveFeaturesResponse
 * @summary active booking features for site
 * @property {Boolean} applicableForServiceList
 * @property {Boolean} applicableForGroups
 * @property {Boolean} applicableForSmsReminders
 * @property {Boolean} applicableForReminders
 * @property {Boolean} applicableForPayments
 * @property {Boolean} applicableForIndividual
 * @property {Number} bookingsStaffLimit
 * @property {Boolean} applicableForCourse
 */

/**
 * @typedef wix-bookings-backend~NotificationView
 * @summary Notification presentation that available to the user of users
 * @property {String} type Defines the type of notification
 * One of:
 *  + "UNDEFINED"
 *  + "CONFIRMATION_EMAIL"
 *  + "CANCELLATION_EMAIL"
 *  + "REMINDER_EMAIL"
 *  + "REMINDER_SMS"
 * @property {Boolean} isEnabled Identifies if the notification is Enabled
 * @property {Array<String>} tags Tags of notification. Optional.  e.g., tag as the service type.
 * @property {Boolean} requireParticipantConsent Specifies whether a user of user would be asked to select this notification.
 */

/**
 * @typedef wix-bookings-backend~ListResourcesRequest
 * @property {wix-bookings-backend~Query} query
 * @property {Boolean} includeDeleted
 */

/**
 * @typedef wix-bookings-backend~Paging
 * @summary Limit number of results
 * @property {Number} limit The number of items to load
 * @property {Number} offset number of items to skip in the current sort order
 */

/**
 * @typedef wix-bookings-backend~Header
 * @summary Form header
 * @property {String} description Form description (displayed below the header in Wix Bookings UI).
 * @property {String} title Form title.
 * @property {Boolean} isDescriptionHidden Whether the form description should be displayed in the Wix Bookings UI.
 */

/**
 * @typedef wix-bookings-backend~TextLabel
 * @property {String} label Additional label applied to this text-only field.
 */

/**
 * @typedef wix-bookings-backend~FutureBookingPolicy
 * @summary Advance booking policy - how far in advance a participant can book sessions, calculated from the current time.
 * @property {Boolean} shouldLimit Whether a limit should be imposed on advance bookings.
 * @property {Number} limitXMinutesToTheFuture How far in advance a participant can book a session, calculated from the current time. Defaults to 10,080 minutes (3 days).
 */

/**
 * @typedef wix-bookings-backend~Query
 * @property {Array<String>} fieldsets Projection on the result object - list of named projections. E.g. "basic" will return id and name fields. Specifying multiple fieldsets will return the union of fields from all. Specifying fieldsets and fields will also return the union of fields.
 * @property {wix-bookings-backend~Value} filter A filter object. See documentation [here](https://bo.wix.com/wix-docs/rnd/platformization-guidelines/api-query-language#platformization-guidelines_api-query-language_defining-in-protobuf)
 * @property {wix-bookings-backend~Paging} paging Limit number of results
 * @property {Array<String>} fields Projection on the result object - list of specific field names to return. If fieldsets are also specified, return the union of fieldsets and fields
 * @property {Array<wix-bookings-backend~Sorting>} sort Sort object in the form [{"fieldName":"sortField1"},{"fieldName":"sortField2","direction":"DESC"}]
 */

/**
 * @typedef wix-bookings-backend~Error
 * @property {String} message
 * @property {String} code
 */

/**
 * @typedef wix-bookings-backend~Slug
 * @summary The slug is the remainder of the URI which can be used to access the service's page and service's booking page in WiX Bookings.
 * @property {String} name The part of service URL that identifies the service's information page.
 * @property {Date} createdAt
 */

/**
 * @typedef wix-bookings-backend~BookingsApprovalPolicy
 * @summary Bookings approval policy for this service. Empty by default.
 * @property {Boolean} isBusinessApprovalRequired Whether bookings to this service require approval.
 * @property {Boolean} requestsAffectsAvailability Whether the bookings requests affect the session or slot availability (e.g., 3 bookings requests for a 10-person session will cause this session to be displayed as having 7 available spots, before the requests are approved).
 */

/**
 * @typedef wix-bookings-backend~GetResourceRequest
 * @property {String} id Resource ID.
 * @property {Array<String>} fields Field names to return in response (leave empty to get all fields).
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~PricingPlan
 * @summary A service catalog information of paid plan that can be used to book this service.
 * @property {String} id The ID of the paid plan.
 * @property {String} name The name of the plan.
 * @property {String} status Status  of the plan
 * One of:
 *  + "UNDEFINED"
 *  + "ACTIVE"
 *  + "ARCHIVED"
 * @property {Boolean} visible Visibility
 */

/**
 * @typedef wix-bookings-backend~BookingPolicy
 * @summary Description of the bookings policy for this service.
 * @property {Number} bookUpToXMinutesBefore Latest amount of time that a participant can book before the start time of the booked item (When applied to a schedule this refers to the start time of the first upcoming session (excluding past sessions). Defaults to 0.
 * @property {Boolean} isBookOnlineAllowed Whether online booking is available. Defaults to true.
 * @property {wix-bookings-backend~WaitingListPolicy} waitingListPolicy Waitlist policy for the service. Empty by default.
 * @property {wix-bookings-backend~BookingsApprovalPolicy} bookingsApprovalPolicy Bookings approval policy for this service. Empty by default.
 * @property {Number} maxParticipantsPerBooking Max. number of participants per booking that can be specified when booking. Defaults to 1.
 * @property {Number} cancelRescheduleUpToXMinutesBefore Latest amount of time that a participant can cancel or reschedule the booking before the start time. Defaults to 0.
 * @property {Boolean} isRescheduleAllowed Whether bookings for this service can be rescheduled. Defaults to true.
 * @property {wix-bookings-backend~FutureBookingPolicy} futureBookingsPolicy Advance booking policy - how far in advance a participant can book sessions, calculated from the current time.
 * @property {Boolean} isCancelAllowed Whether bookings for this service can be canceled. Defaults to true.
 */

/**
 * @typedef wix-bookings-backend~GetServiceRequest
 * @property {String} id Service ID.
 * @property {Array<String>} fields Field names to return in response (leave empty to get all fields).
 */

/**
 * @typedef wix-bookings-backend~GetNotificationViewResponse
 * @summary notifications view settings
 * @property {Array<wix-bookings-backend~NotificationView>} notifications
 * @property {Array<wix-bookings-backend~Error>} errors
 */

/**
 * @typedef wix-bookings-backend~AvailabilityConstraints
 * @summary Additional constraints for calculating the schedule's availability for booking. Optional.
Describes how to calculate the specific slots that are available for booking.
 * @property {Array<Number>} slotDurations The optional durations of the available slots in minutes. Required. Minimum: 1.
Calculation of the available slots will generate slots with these durations if are not produce a conflict with the available intervals.
 * @property {Number} timeBetweenSlots The time between slots in minutes.
If a slot has already booked, then the start time of the next available slot will be calculated by the booked slot's end time plus the time_between_slots value.
Minimum: 0. Maximum: 120.
 * @property {Number} splitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
Optional. The default is the first duration in slot_durations field.
Deprecated. please use the split_slots_interval.value_in_minutes.
 * @property {wix-bookings-backend~SplitInterval} slotsSplitInterval Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00). (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~AddressFields
 * @summary Customer's address (displayed in Wix Bookings UI only when a service’s location is set to "Customer’s Place").
 * @property {wix-bookings-backend~FormField} street
 * @property {wix-bookings-backend~FormField} city
 * @property {wix-bookings-backend~FormField} floorNumber
 * @property {wix-bookings-backend~FormField} state
 */

/**
 * @typedef wix-bookings-backend~Frequency
 * @summary The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Number} repetition The frequency of the recurrence in weeks. i.e. when this value is 4, the interval occurs every 4 weeks. Optional. The default is 1. minimum: 1, maximum: 52.
 */

/**
 * @typedef wix-bookings-backend~AdditionalLabel
 * @property {wix-bookings-backend~label} label
 */

/**
 * @typedef wix-bookings-backend~Interval
 * @summary The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} daysOfWeek The day the interval accrue. Optional. The default is the day of the recurring interval's start time.
 * One of:
 *  + "UNDEFINED"
 *  + "MON"
 *  + "TUE"
 *  + "WED"
 *  + "THU"
 *  + "FRI"
 *  + "SAT"
 *  + "SUN"
 * @property {Number} hourOfDay The hour of the day the interval accrue. must be consistent with the Interval start time. Options. The default is 0. minimum: 0, maximum: 23.
 * @property {Number} minuteOfHour The minutes of hour the interval accrue. must be consistent with the Interval end time. Options. The default is 0. minimum: 0, maximum: 59.
 * @property {Number} duration The duration of the interval in minutes. Required. Part of the session end time calculation. minimum: 1, maximum: 86400.
 */

/**
 * @typedef wix-bookings-backend~FieldConstraints
 * @summary Constraints applied to this field.
 * @property {Boolean} required Whether customer's input in this field is required.
 */

/**
 * @typedef wix-bookings-backend~ListServicesRequest
 * @summary List catalog items request
 * @property {wix-bookings-backend~Query} query
 * @property {Boolean} includeDeleted
 */

/**
 * @typedef wix-bookings-backend~ActionLabels
 * @summary Available payment actions.
 * @property {String} offlinePaymentLabel Call to Action (CTA) text to display in Wix Bookings UI for in-person payment.
 * @property {String} onlinePaymentLabel Call to Action (CTA) text to display in Wix Bookings UI for online payment.
 * @property {String} bookingRequestApprovalLabel Call to Action (CTA) text to display in Wix Bookings UI for requesting booking approval.
 */

/**
 * @typedef wix-bookings-backend~ExternalCalendarOverrides
 * @summary Optional.
When provided, the values will be used to override default fields values which are synced to external calendar.
Read more in external calendar documentation.
 * @property {String} title Optional. When provided this value will be used in the synced title of the external calendar event. Default is Session.title
 * @property {String} description Optional. When provided this value will be used in the synced description of the external calendar event.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session as free-form text. Optional.
This is the default location of the schedule's sessions.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~SplitInterval
 * @summary Specify how to split the slots in intervals of minutes.
This value indicates the time between available slots' start time. e.g., from 5 minute slots (3:00, 3:05, 3:15) and 1 hour slots (3:00, 4:00, 5:00).
 * @property {Boolean} sameAsDuration Required. Indicates where the value for schedules split interval is specifies.
In case this field is true, the value will be the sum of the first duration in
schedule.availabilityConstraints.SlotDurations field and schedule.availabilityConstraints.TimeBetweenSlots field.
 * @property {Number} valueInMinutes Required in case the same_as_duration field is false.
Optional in case the same_as_duration field is true.
 */

/**
 * @typedef wix-bookings-backend~BulkResponse
 * @property {wix-bookings-backend~GetBusinessResponse} responseBusiness
 * @property {wix-bookings-backend~ListResourcesResponse} responseResources
 * @property {wix-bookings-backend~GetServiceResponse} responseService
 * @property {wix-bookings-backend~GetResourceResponse} responseResource
 * @property {wix-bookings-backend~ListServicesResponse} responseServices
 */

/**
 * @typedef wix-bookings-backend~PaymentOptions
 * @summary Various payment options available for use when booking this service.
 * @property {Boolean} wixPayOnline Whether a booking made for this service can be paid online through Wix.
 * @property {Boolean} wixPayInPerson Whether a booking made for this service can be paid in person.
 * @property {Boolean} custom Whether a booking made for this service can be paid in a custom way which is up to the API user to define.
 * @property {Boolean} wixPaidPlan Whether a booking made for this service can be paid using Wix paid plans, e.g., memberships or packages.
 */

/**
 * @typedef wix-bookings-backend~RecurringInterval
 * @property {Array<wix-bookings-backend~LinkedSchedule>} affectedSchedules Specifies the list of linked schedules and the way this link affects the corresponding schedules' availability. Can be calculated from the schedule or overridden on the recurring interval.
 * @property {wix-bookings-backend~Interval} interval The interval rules. The day, hour and minutes the interval is recurring.
 * @property {String} id The recurring interval identifier. (read-only, cannot be set in code)
 * @property {String} intervalType The type of recurring interval.
 * One of:
 *  + "UNDEFINED"
 *  + "EVENT"
 *  + "TIME_AVAILABILITY"
 *  + "AVAILABILITY"
 * @property {Date} end The end time of the recurring interval. Optional. Empty value indicates that there is no end time.
 * @property {wix-bookings-backend~Frequency} frequency The frequency of the interval. Optional. The default is frequency with the default repetition.
 * @property {Date} start The start time of the recurring interval. Required.
 */

/**
 * @typedef wix-bookings-backend~GetBusinessResponse
 * @property {wix-bookings-backend~GetInfoViewResponse} info basig business data
 * @property {wix-bookings-backend~GetPropertiesResponse} businessProperties business properties
 * @property {wix-bookings-backend~GetActiveFeaturesResponse} activeFeatures active booking features for site
 * @property {String} siteUrl site url
 * @property {wix-bookings-backend~GetNotificationViewResponse} notificationsSetup notifications view settings
 */

/**
 * @typedef wix-bookings-backend~label
 * @property {wix-bookings-backend~TextLabel} textLabel
 * @property {wix-bookings-backend~LinkLabel} linkLabel
 */

/**
 * @typedef wix-bookings-backend~GetPropertiesResponse
 * @summary business properties
 * @property {Array<wix-bookings-backend~Property>} customProperties
 * @property {Array<wix-bookings-backend~Error>} errors
 */

/**
 * @typedef wix-bookings-backend~GetInfoViewResponse
 * @summary basig business data
 * @property {String} googleFormattedAddress
 * @property {String} name Name of the business
 * @property {String} email Business email
 * @property {String} formattedAddress Address of business, formatted according to bookings business needs
 * @property {String} businessType Business the go or using business address
 * One of:
 *  + "UNDEFINED"
 *  + "ON_THE_GO"
 *  + "ON_LOCATION"
 * @property {Array<wix-bookings-backend~Error>} errors
 * @property {String} locale
 * @property {String} language Language of bookings site
 * @property {String} countryCode Business time zone
 * @property {String} currency Business currency
 * @property {String} premiumInfo
 * One of:
 *  + "UNDEFINED"
 *  + "BOOKINGS_PREMIUM"
 *  + "WIX_PREMIUM"
 *  + "NO_PREMIUM"
 * @property {String} timeZone Business time zone
 * @property {String} phone Business phone number
 */

/**
 * @typedef wix-bookings-backend~Service
 * @summary The service entity
 * @property {String} categoryId ID of the category for which the service belongs
 * @property {wix-bookings-backend~PaymentOptions} paymentOptions Various payment options available for use when booking this service.
 * @property {Array<String>} scheduleIds List of schedules of the different sessions and slots which can be booked by visitors and owners for this service. Currently only one schedule is allowed. (read-only, cannot be set in code)
 * @property {wix-bookings-backend~ServiceInfo} info Information about the service.
 * @property {Object<String, String>} customProperties Set of key-value pairs.Set of custom properties that can be used to hold information in the context of a specific service.
 * @property {String} id Service ID. (read-only, cannot be set in code)
 * @property {String} status Status of the service.
 * One of:
 *  + "CREATED"
 *  + "DELETED"
 * (read-only, cannot be set in code)
 * @property {Number} sortOrder Sorting order of the service within its category.
 * @property {String} bookingFormId ID of the form that visitors will fill out when booking this service.
 * @property {wix-bookings-backend~BookingPolicy} policy Description of the bookings policy for this service.
 */

/**
 * @typedef wix-bookings-backend~ConferenceProvider
 * @summary Conferencing Provider. A schedule with a conferencing provider will use to provider information to create a conference meeting on the provider's system when a session is created on the schedule or on one of its linked schedule's.
 * @property {String} providerId Conferencing provider ID
 */

/**
 * @typedef wix-bookings-backend~FormField
 * @property {String} fieldId Field ID. (read-only, cannot be set in code)
 * @property {String} valueType
 * One of:
 *  + "SHORT_TEXT"
 *  + "LONG_TEXT"
 *  + "CHECK_BOX"
 * @property {String} label Field label.
 * @property {wix-bookings-backend~FieldConstraints} userConstraints Constraints applied to this field.
 * @property {Array<wix-bookings-backend~AdditionalLabel>} additionalLabels Additional labels applied to this field.
 */

/**
 * @typedef wix-bookings-backend~GetBusinessRequest
 * @property {Boolean} suppressNotFoundError
 */

/**
 * @typedef wix-bookings-backend~QueryMetaData
 * @property {Number} items
 * @property {Number} offset
 * @property {Number} totalCount
 */

/**
 * @typedef wix-bookings-backend~Category
 * @summary Category associated with the service.
 * @property {String} name Category name.
 * @property {Object<String, String>} customProperties Set of key-value pairs.Custom properties that can be associated with the category.
 * @property {String} id Category ID. (read-only, cannot be set in code)
 * @property {String} status Category status (read-only).
 * One of:
 *  + "CREATED"
 *  + "DELETED"
 * (read-only, cannot be set in code)
 * @property {Number} sortOrder Sorting order of the category for Wix Bookings UI.
 */

/**
 * @typedef wix-bookings-backend~BulkRequest
 * @property {wix-bookings-backend~ListResourcesRequest} requestListResources
 * @property {wix-bookings-backend~ListServicesRequest} requestServices
 * @property {wix-bookings-backend~GetResourceRequest} requestGetResource
 * @property {wix-bookings-backend~GetServiceRequest} requestService
 * @property {wix-bookings-backend~GetBusinessRequest} requestBusiness
 */

/**
 * @typedef wix-bookings-backend~LinkedSchedule
 * @property {String} scheduleId Schedule Identifier.
 * @property {String} transparency Indicates if the schedule is available during the session. Possible values are: FREE - the schedule is available during the session. BUSY - schedule are not available during the session, this is the default value.
 * One of:
 *  + "UNDEFINED"
 *  + "FREE"
 *  + "BUSY"
 * @property {String} scheduleOwnerId The linked schedule owner id. Read only. Derived from the schedule_id. (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~LinkLabel
 * @property {String} label Additional label applied to this URL-only field.
 * @property {String} url Returned URL.
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this schedule's slots. Optional. The default is no rate.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~kind
 * @summary The kind of value.
 * @property {String} nullValue Represents a null value.
 * One of:
 *  + "NULL_VALUE"
 * @property {Boolean} boolValue Represents a boolean value.
 * @property {Number} numberValue Represents a double value.
 * @property {String} stringValue Represents a string value.
 * @property {Array<wix-bookings-backend~Value>} listValue Represents a repeated `Value`.
 * @property {Object} structValue Represents a structured value.
 */

/**
 * @typedef wix-bookings-backend~Image
 * @property {String} id WixMedia image ID
 * @property {String} url URL of image
 * @property {Number} height Original image width
 * @property {Number} width Original image height
 */

/**
 * @typedef wix-bookings-backend~ListServicesResponse
 * @summary A list of catalog service response.
 * @property {Array<wix-bookings-backend~GetServiceResponse>} services
 * @property {wix-bookings-backend~QueryMetaData} metadata
 * @property {String} responseType
 * One of:
 *  + "CONSISTENT"
 *  + "EVENTUALLY_CONSISTENT"
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~type
 * @property {wix-bookings-backend~SetOfSessions} setOfSessions
 * @property {wix-bookings-backend~SingleSession} singleSession
 */

/**
 * @typedef wix-bookings-backend~ListWaitingListRequest
 * @property {Array<String>} waitingResources List of sessions (waitingResources) with active waitlists.
 */

/**
 * @typedef wix-bookings-backend~ContactDetails
 * @summary The contact details describing the owner of this booking.
 * @property {String} email Contact email. Mandatory field. used to create a new contact or get existing one from Contacts Service.
 * @property {String} lastName Contact last name.
 * @property {String} firstName Contact first name.
 * @property {String} countryCode Contact country of origin
 * @property {String} contactId Contact identifier used in Contact Service.  this field is read-only except in Book method.
 * @property {String} address Contact address.
 * @property {String} timeZone Contact time-zone.
 * @property {String} phone Contact phone.
 */

/**
 * @typedef wix-bookings-backend~WixPayDetails
 * @property {Date} orderApprovalTime
 * @property {String} orderId Cashier order Id
 * @property {String} orderAmount The order amount we issued to Cashier.
 * @property {String} orderStatus Transaction status
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "PENDING_MERCHANT"
 *  + "COMPLETE"
 *  + "FAILED"
 *  + "DECLINED"
 *  + "PENDING_MARK_AS_PAID"
 *  + "CANCELED"
 * @property {String} paymentVendorName Payment vendor name
 * @property {String} txId Cashier transaction Id
 */

/**
 * @typedef wix-bookings-backend~RegisterResponse
 * @property {String} registrationId
 */

/**
 * @typedef wix-bookings-backend~PaymentSelection
 * @property {String} rateLabel The label represent this booking rate, or free/custom if unspecified.
 * @property {Number} numberOfParticipants The number of participants register to this booking. Mandatory field.
 */

/**
 * @typedef wix-bookings-backend~EnrollResponse
 * @property {String} registrationId
 * @property {wix-bookings-backend~Booking} booking Checked-out booking.
 (Online-payments can only be completed in the Wix Bookings UI.)
 */

/**
 * @typedef wix-bookings-backend~WaitingListEntry
 * @property {Array<wix-bookings-backend~Registration>} registrations List of registrants to the waitlist.
 * @property {String} status The Waitlist's current status:
 IDLE - Waiting for a cancellation that will free up a spot in the session.
 SUGGESTING - Currently suggesting a free spot to a registrant in the waitlist. The service will keep suggesting until the end of the list is reached, or until all free spots are filled.
 OPEN_TO_ALL - Once we got to the end of the list - booking is opened for the session, and any registrant on the list can book.
 * One of:
 *  + "UNDEFINED"
 *  + "IDLE"
 *  + "SUGGESTING"
 *  + "OPEN_TO_ALL"
 * @property {String} waitingResource The waitlisted session ID.
 * @property {Number} timeWindowMinutes Waitlisted session's "suggesting" time window. Defined as part of the service's booking policy.
 * @property {Number} numberOfRegistrations
 * @property {Number} capacity Waitlisted session's capacity. Defined as part of the service's booking policy.
 */

/**
 * @typedef wix-bookings-backend~CustomFormField
 * @property {String} id The id of the form field as defined in the form entity
 * @property {String} value Value that was submitted per this field
 * @property {String} label Snapshot of the form field label during form submission. (read-only, cannot be set in code)
 * @property {String} valueType
 * One of:
 *  + "SHORT_TEXT"
 *  + "LONG_TEXT"
 *  + "CHECK_BOX"
 */

/**
 * @typedef wix-bookings-backend~BookedEntity
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this session at the time of booking.
 * @property {wix-bookings-backend~Location} location Geographic location of the session.
 * @property {Array<String>} tags
 * @property {String} scheduleId
 * @property {String} title Session title at the time of booking.
 * @property {wix-bookings-backend~type} type
 * @property {String} serviceId
 * @property {wix-bookings-backend~OnlineConference} onlineConference Online conference information
 */

/**
 * @typedef wix-bookings-backend~EnrollRequest
 * @property {String} registrationId Registration to book.
 * @property {String} couponCode Coupon code to apply to this booking at checkout.
 * @property {wix-bookings-backend~PaidPlan} planSelection Selected paid plan to apply to this booking at checkout.
 * @property {Boolean} notifyParticipants
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~OnlineConference
 * @summary Online conference information
 * @property {String} guestUrl participant url
 * @property {String} providerId online conference provider identifier
 * @property {String} password online conference password
 */

/**
 * @typedef wix-bookings-backend~RegisterRequest
 * @property {String} waitingResource Resource to be waitlisted for.
 Currently only supports session ID.
 * @property {wix-bookings-backend~FormInfo} formInfo Participant information as filled in the booking form (required).
 Contains contact details and other form fields specified by the owner for this 'waiting resource' (service).
 * @property {wix-bookings-backend~LocalDateTime} presentedStartTime Service start time as presented to the user. For validation - Optional.
 * @property {wix-bookings-backend~LocalDateTime} presentedEndTime Service end time presented to the user. For validation - Optional.
 */

/**
 * @typedef wix-bookings-backend~PaidPlanDetails
 * @summary Paid plan details used to pay for the booking.
 * @property {Number} currentCredit
 * @property {String} planName Plan name
 * @property {Number} originalCredit
 * @property {wix-bookings-backend~PaidPlan} plan Plan details
 * @property {String} transactionId Transaction id created in Paid Plans Benefit service.
 */

/**
 * @typedef wix-bookings-backend~SingleSession
 * @property {String} sessionId
 * @property {Date} start The start time of the session.
 * @property {Date} end The end time of the session.
 */

/**
 * @typedef wix-bookings-backend~ListWaitingListResponse
 * @property {Array<wix-bookings-backend~WaitingListEntry>} list
 */

/**
 * @typedef wix-bookings-backend~FormInfo
 * @summary Form info submitted when booking. Contains contact details, participants, other form fields specified by the owner for the choosen service.
 Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~ContactDetails} contactDetails The contact details describing the owner of this booking.
 * @property {Array<wix-bookings-backend~PaymentSelection>} paymentSelection
 * @property {Object<String, String>} customFormFields Set of key-value pairs. Other custom field values that were specified by the user. In the form of field_id to value mapping.
 Deprecated. Is being replaced with additional_fields.
 * @property {Array<wix-bookings-backend~CustomFormField>} additionalFields Additional custom fields submitted with the form.
 */

/**
 * @typedef wix-bookings-backend~AvailableActions
 * @summary Currently available actions for this registration.
 * @property {Boolean} leave Whether the registrant can leave the waitlist.
 * @property {Boolean} enroll Whether the registrant can book from the waitlist.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~PaidPlan
 * @summary Selected paid plan to apply to this booking at checkout.
 * @property {String} orderId
 * @property {String} benefitId
 * @property {String} planId
 */

/**
 * @typedef wix-bookings-backend~BookedResource
 * @property {String} id
 * @property {String} name Resource's name at the time of booking
 * @property {String} email Resource's email at the time of booking. Optional.
 */

/**
 * @typedef wix-bookings-backend~AttendanceInfo
 * @summary Attendance Info. Optional
 * @property {Boolean} attendanceStatus Indicated whether the booked contact attended the session
 * @property {Number} numberOfAttendees The number of attendees that attended. Can be more than 1 if the booking was with accompanied party
 */

/**
 * @typedef wix-bookings-backend~BookingSource
 * @property {String} platform The platform from which a booking was created
 * One of:
 *  + "UNDEFINED_PLATFORM"
 *  + "WEB"
 *  + "MOBILE_APP"
 * @property {String} actor The actor that created this booking
 * One of:
 *  + "UNDEFINED_ACTOR"
 *  + "BUSINESS"
 *  + "CUSTOMER"
 * @property {String} appDefId The appDefId of the application that created this booking (read-only, cannot be set in code)
 * @property {String} appName The name of the application that created this booking, as saved in Wix-dev-center at the time of booking (read-only, cannot be set in code)
 */

/**
 * @typedef wix-bookings-backend~Registration
 * @property {String} bookingId Registration's associated booking
 * @property {String} id Registration ID
 * @property {wix-bookings-backend~AvailableActions} availableActions Currently available actions for this registration.
 * @property {String} status Registration status
 WAITING - Registrant is on the waitlist. Waiting to be suggested a spot.
 SUGGESTING - Registrant is currently being suggested an opened spot.
 DECLINED - Registration has been declined.
 ENROLLED - Registrant has been enrolled to a suggested spot.
 * One of:
 *  + "UNDEFINED"
 *  + "WAITING"
 *  + "SUGGESTING"
 *  + "DECLINED"
 *  + "ENROLLED"
 * @property {String} waitingResource Resource to be waitlisted for.
 Currently only supports session ID.
 */

/**
 * @typedef wix-bookings-backend~SetOfSessions
 * @property {Date} firstSessionStart The start time of the first session.
 * @property {Date} lastSessionEnd The end time of the last session.
 */

/**
 * @typedef wix-bookings-backend~LocalDateTime
 * @summary Service end time presented to the user. For validation - Optional.
 * @property {Number} hourOfDay
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @property {Number} monthOfYear
 * @property {Number} minutesOfHour
 */

/**
 * @typedef wix-bookings-backend~PaymentDetails
 * @summary Payment Details. Optional. On Create, in case of a given empty field, this booking will not be send to checkout for payment.
 * @property {String} state Checkout current state.
 * One of:
 *  + "UNDEFINED"
 *  + "COMPLETE"
 *  + "PENDING_CASHIER"
 *  + "REJECTED"
 *  + "READY"
 *  + "CANCELED"
 *  + "REFUNDED"
 *  + "PENDING_MERCHANT"
 *  + "WIX_PAY_FAILURE"
 *  + "PENDING_MARK_AS_PAID"
 *  + "PENDING_BUYER"
 * @property {wix-bookings-backend~WixPayDetails} wixPayDetails [DEPRECATED]. USE wix_pay_multiple_details.
 * @property {wix-bookings-backend~PaidPlanDetails} paidPlanDetails Paid plan details used to pay for the booking.
 * @property {wix-bookings-backend~Balance} balance The booking Balance.
 * @property {String} id Checkout identifier.
 * @property {Array<wix-bookings-backend~WixPayDetails>} wixPayMultipleDetails In case of wix-pay service, holds all payment history for a booking.
 * @property {wix-bookings-backend~CouponDetails} couponDetails temporarily in-out , when available indicate coupon usage.
 */

/**
 * @typedef wix-bookings-backend~Booking
 * @summary Checked-out booking.
 (Online-payments can only be completed in the Wix Bookings UI.)
 * @property {Array<wix-bookings-backend~BookedResource>} bookedResources
 * @property {wix-bookings-backend~FormInfo} formInfo Form info submitted when booking. Contains contact details, participants, other form fields specified by the owner for the choosen service.
 Contact information. Mandatory. contains contact details, participants, other form fields specified by the owner for the choosen service.
 * @property {wix-bookings-backend~BookingSource} bookingSource
 * @property {wix-bookings-backend~PaymentDetails} paymentDetails Payment Details. Optional. On Create, in case of a given empty field, this booking will not be send to checkout for payment.
 * @property {String} id
 * @property {String} externalUserId External Id provided by the client on creation
 * @property {String} status
 * One of:
 *  + "UNDEFINED"
 *  + "PENDING_CHECKOUT"
 *  + "CONFIRMED"
 *  + "CANCELED"
 *  + "PENDING"
 *  + "PENDING_APPROVAL"
 *  + "DECLINED"
 * @property {wix-bookings-backend~BookedEntity} bookedEntity
 * @property {wix-bookings-backend~AttendanceInfo} attendanceInfo Attendance Info. Optional
 * @property {Date} created Created timestamp. Read-only.
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this session at the time of booking.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~Balance
 * @summary The booking Balance.
 * @property {wix-bookings-backend~Price} finalPrice The final calculated price.
 Calculated using the service price multiplied by the booking's number of participants deducted any discount (coupons, etc.)
 * @property {String} amountReceived Amount paid.
 */

/**
 * @typedef wix-bookings-backend~CouponDetails
 * @summary temporarily in-out , when available indicate coupon usage.
 * @property {String} couponName
 * @property {String} couponCode
 * @property {String} couponDiscount
 * @property {String} couponId
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~type
 * @property {wix-bookings-backend~SetOfSessions} setOfSessions
 * @property {wix-bookings-backend~SingleSession} singleSession
 */

/**
 * @typedef wix-bookings-backend~ContactDetails
 * @property {String} email Contact email. Mandatory field. used to create a new contact or get existing one from Contacts Service.
 * @property {String} lastName Contact last name.
 * @property {String} firstName Contact first name.
 * @property {String} countryCode Contact country of origin
 * @property {String} contactId Contact identifier used in Contact Service.  this field is read-only except in Book method.
 * @property {String} address Contact address.
 * @property {String} timeZone Contact time-zone.
 * @property {String} phone Contact phone.
 */

/**
 * @typedef wix-bookings-backend~WixPayDetails
 * @property {Date} orderApprovalTime
 * @property {String} orderId Cashier order Id
 * @property {String} orderAmount The order amount we issued to Cashier.
 * @property {String} orderStatus Transaction status
 * One of:
 *  + "UNDEFINED"
 *  + "CREATED"
 *  + "PENDING_MERCHANT"
 *  + "COMPLETE"
 *  + "FAILED"
 *  + "DECLINED"
 *  + "PENDING_MARK_AS_PAID"
 *  + "CANCELED"
 * @property {String} paymentVendorName Payment vendor name
 * @property {String} txId Cashier transaction Id
 */

/**
 * @typedef wix-bookings-backend~PaymentSelection
 * @property {String} rateLabel The label represent this booking rate, or free/custom if unspecified.
 * @property {Number} numberOfParticipants The number of participants register to this booking. Mandatory field.
 */

/**
 * @typedef wix-bookings-backend~BookedEntity
 * @property {wix-bookings-backend~Rate} rate The price options offered to book this session at the time of booking.
 * @property {wix-bookings-backend~Location} location Geographic location of the session.
 * @property {Array<String>} tags
 * @property {String} scheduleId
 * @property {String} title Session title at the time of booking.
 * @property {wix-bookings-backend~type} type
 * @property {String} serviceId
 * @property {wix-bookings-backend~OnlineConference} onlineConference Online conference information
 */

/**
 * @typedef wix-bookings-backend~Price
 * @summary `key` of type string, `value` of type ref
 * @property {String} amount The price amount
 * @property {String} currency Currency
 * @property {String} downPayAmount Optional. Represents a required down payment as part of the transaction process.
 */

/**
 * @typedef wix-bookings-backend~OnlineConference
 * @summary Online conference information
 * @property {String} guestUrl participant url
 * @property {String} providerId online conference provider identifier
 * @property {String} password online conference password
 */

/**
 * @typedef wix-bookings-backend~PaidPlanDetails
 * @summary Paid plan details used to pay for the booking.
 * @property {Number} currentCredit
 * @property {String} planName Plan name
 * @property {Number} originalCredit
 * @property {wix-bookings-backend~PaidPlan} plan Plan details
 * @property {String} transactionId Transaction id created in Paid Plans Benefit service.
 */

/**
 * @typedef wix-bookings-backend~SingleSession
 * @property {String} sessionId
 * @property {Date} start The start time of the session.
 * @property {Date} end The end time of the session.
 */

/**
 * @typedef wix-bookings-backend~Location
 * @summary Geographic location of the session.
 * @property {String} locationType
 * One of:
 *  + "UNDEFINED"
 *  + "OWNER_BUSINESS"
 *  + "OWNER_CUSTOM"
 *  + "CUSTOM"
 * @property {String} address The address as set by the owner. Valid only when location_type is OWNER_CUSTOM.
 */

/**
 * @typedef wix-bookings-backend~PaidPlan
 * @summary Plan details
 * @property {String} orderId
 * @property {String} benefitId
 * @property {String} planId
 */

/**
 * @typedef wix-bookings-backend~SetOfSessions
 * @property {Date} firstSessionStart The start time of the first session.
 * @property {Date} lastSessionEnd The end time of the last session.
 */

/**
 * @typedef wix-bookings-backend~PaymentDetails
 * @property {String} state Checkout current state.
 * One of:
 *  + "UNDEFINED"
 *  + "COMPLETE"
 *  + "PENDING_CASHIER"
 *  + "REJECTED"
 *  + "READY"
 *  + "CANCELED"
 *  + "REFUNDED"
 *  + "PENDING_MERCHANT"
 *  + "WIX_PAY_FAILURE"
 *  + "PENDING_MARK_AS_PAID"
 *  + "PENDING_BUYER"
 * @property {wix-bookings-backend~WixPayDetails} wixPayDetails [DEPRECATED]. USE wix_pay_multiple_details.
 * @property {wix-bookings-backend~PaidPlanDetails} paidPlanDetails Paid plan details used to pay for the booking.
 * @property {wix-bookings-backend~Balance} balance The booking Balance.
 * @property {String} id Checkout identifier.
 * @property {Array<wix-bookings-backend~WixPayDetails>} wixPayMultipleDetails In case of wix-pay service, holds all payment history for a booking.
 * @property {wix-bookings-backend~CouponDetails} couponDetails temporarily in-out , when available indicate coupon usage.
 */

/**
 * @typedef wix-bookings-backend~Rate
 * @summary The price options offered to book this session at the time of booking.
 * @property {Object<String, wix-bookings-backend~Price>} labeledPriceOptions Set of key-value pairs.Mapping between a named price option and the Price itself.
 * @property {String} priceText User defined textual price. Optional.
 */

/**
 * @typedef wix-bookings-backend~Balance
 * @summary The booking Balance.
 * @property {wix-bookings-backend~Price} finalPrice The final calculated price.
 Calculated using the service price multiplied by the booking's number of participants deducted any discount (coupons, etc.)
 * @property {String} amountReceived Amount paid.
 */

/**
 * @typedef wix-bookings-backend~CouponDetails
 * @summary temporarily in-out , when available indicate coupon usage.
 * @property {String} couponName
 * @property {String} couponCode
 * @property {String} couponDiscount
 * @property {String} couponId
 *//**
 * @namespace wix-bookings-backend
 */

/**
 * @typedef wix-bookings-backend~SyncStatus
 * @property {String} resourceId Resource ID that owns a schedule to be synced with the external calendar.
 * @property {String} calendar External calendar type.
 * One of:
 *  + "GOOGLE"
 * @property {String} status External calendar sync status.
 * One of:
 *  + "UNDEFINED"
 *  + "NONE"
 *  + "CONNECTED"
 *  + "PENDING"
 *  + "DISCONNECTED"
 *  + "DISCONNECTED_TOKEN_REVOKED"
 */