import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { StyledCard, deleteModal } from '../styled';
import createEventImg from '../assets/undraw_blooming_jtv6.svg';
import {
  CreateEventPartOne,
  CreateEventPartTwo,
  CreateEventPartThree,
  CreateEventPartFour,
} from '../components/CreateEvent';
import { Steps } from 'antd';
import CreateEventReview from '../components/CreateEvent/CreateEventReview/CreateEventReview';
import { useStateValue } from '../hooks/useStateValue';
import { createEvent, createRecurringEvent } from '../actions';

let { Step } = Steps;

export const CreateEvent = props => {
  const initialEvent = {
    nameOfEvent: '',
    typesOfCauses: [],
    date: '',
    startTime: moment('00:00:00', 'HH:mm'),
    endTime: moment('00:00:00', 'HH:mm'),
    numberOfVolunteers: '',
    phoneNumber: '',
    pointOfcontact: '',
    volunteerRequirements: [],
    interest: [],
    website: '',
    dynamicDates: {
      dynamicDay: '',
      dynamicYear: '',
      dynamicNumber: '',
      dynamicNth: '',
    },
    recurringInfo: {
      repeatTimePeriod: '',
      occurrenceEnds: 'Never',
      occurrenceEndDate: '',
      occurrenceEndsAfter: '',
      days: [],
    },
  };

  const [localState, setLocalState] = useState(initialEvent);

  const formTitles = {
    1: 'Create An Event',
    2: 'Create An Event',
    3: 'Almost Finished Creating Your Event!!',
    4: 'Almost Finished Creating Your Event!!',
    5: "Here's What We Got",
  };

  const formParts = {
    1: CreateEventPartOne,
    2: CreateEventPartTwo,
    3: CreateEventPartThree,
    4: CreateEventPartFour,
    5: CreateEventReview,
  };

  const steps = [
    {
      title: 'Start',
    },
    {},
    {},
    {},
    {
      title: 'Finished',
    },
  ];
  let [pageNumber, setPageNumber] = useState(1);

  const [state, dispatch] = useStateValue();

  //Destructuring
  const { recurringInfo, recurringEvent } = localState;

  const RenderedFormParts = formParts[pageNumber];

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
      streetAddress: localState.streetAddress,
      city: localState.city,
      state: localState.state,
      date: localState.date.unix(),
      startTime: localState.startTime.format('LT'),
      endTime: localState.endTime.format('LT'),
      startTimeStamp: moment(
        localState.date.format('LL') + ' ' + localState.startTime.format('LT')
      ).unix(),
      endTimeStamp: moment(
        localState.date.format('LL') + ' ' + localState.endTime.format('LT')
      ).unix(),
      numberOfVolunteers: localState.numberOfVolunteers,
      typesOfCauses: localState.typesOfCauses,
      interest: localState.interest,
      volunteerRequirements: localState.volunteerRequirements,
      pointOfContact: {
        firstName: localState.firstName,
        lastName: localState.lastName,
        phoneNumber: localState.phoneNumber,
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
      // console.log('rec', event);
      createRecurringEvent(event, dispatch);
    } else {
      // console.log('reg', event);
      createEvent(event, dispatch);
    }
    setPageNumber(1);

    props.history.push('/org-dashboard');
  };

  const handleChange = (name, value) => {
    setLocalState({
      ...localState,
      [name]: value,
    });
  };
  ///Cancel Form
  const cancelForm = () => {
    console.log('hello');
    const cancelFormModal = deleteModal({
      title: 'Are you suure you want to cancel ?',
      content: 'All information will be delete.',
      onOk: () => props.history.push('/org-dashboard'),
    });
    cancelFormModal();
  };

  //Handle Form Parts Submit
  const handlePageForward = () => {
    setPageNumber(pageNumber + 1);
  };

  //Go Back a Page Number
  const handlePageBack = () => {
    setPageNumber(pageNumber - 1);
  };

  return (
    <div>
      <StyledDiv className={'flex center'}>
        <CustomStyledCard margin="2rem 0 5rem 0" maxWidth="900px">
          <h1>{formTitles[pageNumber]}</h1>
          <StyledImg src={createEventImg} alt="undraw unexpected friends" />
          <Steps current={pageNumber - 1} progressDot size="small">
            {steps.map(step => {
              return <Step key={step} title={step.title} className={'dot'} />;
            })}
          </Steps>
          <StyledRenderDiv>
            <RenderedFormParts
              state={state}
              localState={localState}
              setLocalState={setLocalState}
              handlePageForward={handlePageForward}
              handlePageBack={handlePageBack}
              cancelForm={cancelForm}
              pageNumber={pageNumber}
              handleChange={handleChange}
              handleReviewSubmit={handleReviewSubmit}
            />
          </StyledRenderDiv>
        </CustomStyledCard>
      </StyledDiv>
    </div>
  );
};

const StyledDiv = styled.div`
  background: white;
  .create-org-header {
    color: ${props => props.theme.primary8};
  }
`;

const CustomStyledCard = styled(StyledCard)`
  &&& {
    background: #d9d9d9;
    text-align: center;
    cursor: default;
    transition: none;

    .ant-steps {
      text-align: left;
      margin-bottom: 40px;

      .ant-steps-item-title {
        font-weight: normal;
      }
      .ant-steps-item-finish
        > .ant-steps-item-container
        > .ant-steps-item-tail {
        &::after {
          background: ${({ theme }) => theme.primary8};
        }
      }

      span.ant-steps-icon-dot {
        background: ${({ theme }) => theme.primary8};
      }
    }
  }
`;

const StyledRenderDiv = styled.div`
  background: ${({ theme }) => theme.gray4};
  width: 75%;
  margin: 0 auto;
  font-weight: bold;
  padding: 1.5rem 3rem;
  border-radius: ${({ theme }) => theme.borderRadiusDefault};

  .styledDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 10px;
  }

  label {
    margin-left: 55px;
    color: ${({ theme }) => theme.primary8};

    &::before {
      color: ${({ theme }) => theme.primary8};
    }
  }
  .input {
    width: 80%;
    margin: 0 auto;
  }
  .inline {
    width: 40%;
  }

  h4 {
    margin: 30px 0px;
  }

  .errorFlex {
    dispaly: flex;
    flex-direction: column;
  }

  .error-message.error-span.left-aligned {
    color: red;
    font-size: 12px;
  }
  .city-states-input {
    display: flex;
    justify-content: space-around;

    label {
      margin-left: 20px;
    }
  }
  .time-wrapper {
    display: flex;
    justify-content: center;
    label {
      margin-left: 0px;
    }
  }

  .buttonStyles {
    display: flex;
    margin: 50px auto 0;
    padding-top: 40px;
    padding-right: 50px;
    padding-left: 50px;
    justify-content: space-between;
    border-top: 2px solid ${({ theme }) => theme.primary8};

    button {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
`;

const StyledImg = styled.img`
  width: 211px;
  margin: 2rem auto;
`;

export default CreateEvent;
