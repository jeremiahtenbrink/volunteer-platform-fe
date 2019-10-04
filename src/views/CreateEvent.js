import React, { useState, useEffect } from 'react';
import { useStateValue } from '../hooks/useStateValue';
import { createEvent, createRecurringEvent } from '../actions';
import moment from 'moment';
import {
  CreateEventPartOne,
  CreateEventPartTwo,
  CreateEventPartThree,
  CreateEventPartFour,
  SuccessModal,
} from '../components/CreateEvent';
import CreateEventReview from '../components/CreateEvent/CreateEventReview/CreateEventReview';

export const CreateEvent = props => {
  const initialEvent = {
    nameOfEvent: '',
    typeOfCause: [],
    date: moment('00:00:00', 'HH:mm'),
    startTime: moment('00:00:00', 'HH:mm'),
    endTime: moment('00:00:00', 'HH:mm'),
    numberOfVolunteers: '',
    phoneNumber: '',
    pointOfcontact: '',
    volunteerRequirements: [],
    website: '',
    dynamicDates: {
      dynamicDay: '',
      dynamicYear: '',
      dynamicNumber: '',
      dynamicNth: '',
    },
    recurringInfo: {
      repeatTimePeriod: '',
      occurrenceEnds: '',
      occurrenceEndDate: '',
      occurrenceEndsAfter: '',
    },
  };
  const autoFillParts = {
    1: {},
    2: {},
    3: {},
    4: {},
  };
  const [localState, setLocalState] = useState(initialEvent);
  const [autoFillState, setAutoFillState] = useState(autoFillParts);
  let [pageNumberState, setPageNumberState] = useState({
    pageNumber: 1,
  });

  const [state, dispatch] = useStateValue();

  //Destructuring
  const { recurringInfo, recurringEvent } = localState;

  useEffect(() => {
    if (props.location.state.org) {
      setLocalState({
        ...localState,
        orgId: props.location.state.org.orgId,
      });
    }
  }, [props.location.state.org]);

  //Handle Submit for Form
  const handleReviewSubmit = () => {
    const event = {
      orgId: localState.orgId,
      orgName: props.location.state.org.organizationName,
      orgImagePath: props.location.state.org.imagePath || '',
      orgPage: '',
      nameOfEvent: localState.nameOfEvent,
      city: localState.city,
      email: localState.email,
      phoneNumber: localState.phoneNumber,
      date: localState.date.unix(),
      startTime: localState.startTime.format('LT'),
      endTime: localState.endTime.format('LT'),
      startTimeStamp: moment(
        localState.date.format('LL') + ' ' + localState.startTime.format('LT')
      ).unix(),
      endTimeSTamp: moment(
        localState.date.format('LL') + ' ' + localState.endTime.format('LT')
      ).unix(),
      numberOfVolunteers: localState.numberOfVolunteers,
      typesOfCauses: localState.typesOfCauses,
      interest: localState.interest,
      volunteerRequirements: localState.volunteerRequirements,
      pointOfcontact: {
        firstName: localState.firstName,
        lastName: localState.lastName,
        email: localState.email,
      },
      eventDetails: localState.eventDetails,
      website: localState.website,
      otherNotes: localState.otherNotes,
    };

    if (recurringInfo.recurringEvent === 'Yes') {
      event.recurringInfo = recurringInfo;
      if (event.recurringInfo.occurrenceEnds === 'On') {
        event.recurringInfo.occurrenceEndDate = event.recurringInfo.occurrenceEndDate.unix();
        event.recurringInfo.occurrenceEndsAfter = '';
      }
      if (event.recurringInfo.occurrenceEnds === 'After') {
        event.recurringInfo.occurrenceEndDate = '';
      }
      createRecurringEvent(event, dispatch);
    } else {
      createEvent(event, dispatch);
    }
    setPageNumberState({
      pageNumber: 1,
    });

    props.history.push('/org-dashboard');
  };

  ///Cancel Form
  const cancelForm = () => {
    props.history.push('/org-dashboard');
  };

  //Handle Form Parts Submit
  const handleFormPartSubmit = values => {
    if (pageNumberState.pageNumber) {
      setAutoFillState({
        ...autoFillState,
        [pageNumberState.pageNumber]: values,
      });
    }
    setLocalState({
      ...localState,
      ...values,
      values,
    });
    setPageNumberState({
      pageNumber: pageNumberState.pageNumber + 1,
    });
  };

  //Go Back a Page Number
  const handlePageBack = () => {
    setPageNumberState({
      pageNumber: pageNumberState.pageNumber - 1,
    });
  };

  const renderParts = {
    1: (
      <CreateEventPartOne
        state={state}
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        cancelForm={cancelForm}
        pageNumber={pageNumberState.pageNumber}
        autoFillState={autoFillState}
      />
    ),
    2: (
      <CreateEventPartTwo
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        handlePageBack={handlePageBack}
        pageNumberState={pageNumberState}
        setPageNumberState={setPageNumberState}
        autoFillState={autoFillState}
        setAutoFillState={setAutoFillState}
      />
    ),
    3: (
      <CreateEventPartThree
        state={state}
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        handlePageBack={handlePageBack}
        pageNumber={pageNumberState.pageNumber}
        autoFillState={autoFillState}
      />
    ),
    4: (
      <CreateEventPartFour
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        handlePageBack={handlePageBack}
        pageNumber={pageNumberState.pageNumber}
        autoFillState={autoFillState}
      />
    ),
    5: (
      <CreateEventReview
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        handlePageBack={handlePageBack}
        pageNumber={pageNumberState.pageNumber}
        autoFillState={autoFillState}
        handleReviewSubmit={handleReviewSubmit}
        cancelForm={cancelForm}
      />
    ),
    // 6: <SuccessModal />,
  };
  console.log('localstate', localState);
  return (
    <div>
      {pageNumberState.pageNumber && renderParts[pageNumberState.pageNumber]}
      <CreateEventReview
        localState={localState}
        setLocalState={setLocalState}
        handleSubmit={handleFormPartSubmit}
        handlePageBack={handlePageBack}
        pageNumber={pageNumberState.pageNumber}
        autoFillState={autoFillState}
        handleReviewSubmit={handleReviewSubmit}
        cancelForm={cancelForm}
      />
    </div>
  );
};

export default CreateEvent;
