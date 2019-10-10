import React, { useState } from 'react';
import { StyledCancelButton, StyledButton } from '../../../styled';
import { useStateValue } from '../../../hooks/useStateValue';
import {
  Icon,
  Select,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Form,
} from 'antd';
import styled from 'styled-components';

import RecurringEvent from '../RecurringEvent';

const { TextArea } = Input;
const { Option } = Select;

export const CreateEventReviewEditForm = props => {
  const [state, dispatch] = useStateValue();
  const { localState, setLocalState, setEdit } = props;
  const {
    nameOfEvent,
    streetAddress,
    city,
    typesOfCauses,
    volunteerRequirements,
    interest,
    numberOfVolunteers,
    phoneNumber,
    firstName,
    lastName,
    email,
    date,
    startTime,
    endTime,
    eventDetails,
    website,
    otherNotes,
    dynamicDates,
  } = localState;

  const [error, setError] = useState('');
  const causeAreaTags = state.tags.causeAreas.map(tag => {
    return (
      <Option key={tag} value={tag}>
        {tag}
      </Option>
    );
  });

  const requirementTags = state.tags.requirements.map(tag => {
    return <Option key={tag}>{tag}</Option>;
  });

  const interestTags = state.tags.interests.map(tag => {
    return <Option key={tag}>{tag}</Option>;
  });

  const isFormValid = () => {
    if (
      nameOfEvent &&
      streetAddress &&
      city &&
      localState.state &&
      typesOfCauses.length > 0 &&
      volunteerRequirements.length > 0 &&
      interest.length > 0 &&
      numberOfVolunteers > 0 &&
      firstName &&
      lastName &&
      phoneNumber &&
      eventDetails
    ) {
      return true;
    }
  };

  const checkRequired = () => {
    if (isFormValid()) {
      setError('');
      handleForm();
    } else {
      setError('This field is required.');
    }
  };

  const handleValue = (name, value) => {
    setLocalState({
      ...localState,
      [name]: value,
    });
  };

  const handleForm = () => {
    setEdit(false);
  };

  return (
    <StyledDiv className={'styledReviewDiv'}>
      <div>
        <StyledButtons>
          <div className="icon">
            <Icon type="save" onClick={checkRequired} />
          </div>
          <div className="icon">
            <Icon type="edit" theme="twoTone" twoToneColor="#52c41a" />
          </div>
        </StyledButtons>
      </div>
      <Form layout={'vertical'} onSubmit={() => checkRequired()}>
        <Form.Item label={'Name of Event'} required>
          <div className={'input'}>
            <Input
              name={'nameOfEvent'}
              value={nameOfEvent}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
            {error && !nameOfEvent && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <p className={'title'}>Location</p>
        <Form.Item label={'Street Address'} required>
          <div className={'input'}>
            <Input
              name={'streetAddress'}
              value={streetAddress}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
            {error && !streetAddress && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <div className={'city-states-input'}>
          <Form.Item label={'City'} required>
            <div className={'input'}>
              <Input
                name={'city'}
                value={city}
                onChange={e => handleValue(e.target.name, e.target.value)}
              />
              {error && !city && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item label={'State'} required>
            <div className={'input'}>
              <Input
                name={'state'}
                value={localState.state}
                onChange={e => handleValue(e.target.name, e.target.value)}
              />
              {error && !localState.state && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </Form.Item>
        </div>
        <Form.Item label={'Types of Causes'} required>
          <div className={'errorFlex'}>
            <div className={'input'}>
              <Select
                name={'Types of Causes'}
                mode="multiple"
                value={typesOfCauses}
                onChange={value => handleValue('typesOfCauses', value)}
              >
                {causeAreaTags}
              </Select>
            </div>
            <div>
              {error && !typesOfCauses.length > 0 && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </div>
        </Form.Item>

        <Form.Item label={'Volunteer Requirements'} required>
          <div className={'errorFlex'}>
            <div className={'input'}>
              <Select
                name={'Volunteer Requirements'}
                mode="multiple"
                value={volunteerRequirements}
                onChange={value => handleValue('volunteerRequirements', value)}
              >
                {requirementTags}
              </Select>
            </div>
            <div>
              {error && !volunteerRequirements.length > 0 && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </div>
        </Form.Item>
        <Form.Item label={'Interest'} required>
          <div className={'errorFlex'}>
            <div className={'input'}>
              <Select
                name={'Interest'}
                mode="multiple"
                value={interest}
                onChange={value => handleValue('interest', value)}
              >
                {interestTags}
              </Select>
            </div>
            <div>
              {error && !interest.length > 0 && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </div>
        </Form.Item>
        <p className={'title'}>*How many volunteers do you need?</p>
        <Form.Item required>
          <div className={'errorFlex'}>
            <div className={'input'}>
              <InputNumber
                name={'Number of Volunteers'}
                min={0}
                value={numberOfVolunteers}
                onChange={value => handleValue('numberOfVolunteers', value)}
              />
              {'  '}
              {localState.numberOfVolunteers > 1 ? 'Volunteers' : 'Volunteer'}
            </div>
            <div>
              {error && !numberOfVolunteers > 0 && (
                <span className="error-message error-span left-aligned">
                  {error}
                </span>
              )}
            </div>
          </div>
        </Form.Item>

        <p className={'title'}>*Point of Contact</p>
        <Form.Item label={'First Name'}>
          <div className={'input'}>
            <Input
              name={'firstName'}
              value={firstName}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
            {error && !firstName && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <Form.Item label={'Last Name'}>
          <div className={'input'}>
            <Input
              name={'lastName'}
              value={lastName}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
            {error && !lastName && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <Form.Item label={'Phone Number'} required>
          <div className={'input'}>
            <Input
              name={'phoneNumber'}
              value={phoneNumber}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
            {error && !phoneNumber && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <p className={'title'}>*When is the event?</p>
        <Form.Item required>
          <div className={'input'}>
            <DatePicker
              name={'Date'}
              format={'MM/DD/YYYY'}
              value={date}
              onChange={value => handleValue('date', value)}
            />
          </div>
        </Form.Item>
        <RecurringEvent
          localState={localState}
          setLocalState={setLocalState}
          dynamicDates={dynamicDates}
        />
        <p className={'title'}>*What time?</p>
        <div className={'time-wrapper'}>
          <Form.Item required>
            <div className={'input'}>
              <TimePicker
                name={'Start Time'}
                use12Hours
                format={'h:mm a'}
                value={startTime}
                onChange={value => handleValue('startTime', value)}
              />
            </div>
          </Form.Item>
          <div className="to-p-review">
            <p>to</p>
          </div>
          <Form.Item required>
            <div className={'input'}>
              <TimePicker
                name={'End Time'}
                use12Hours
                format={'h:mm a'}
                value={endTime}
                onChange={value => handleValue('endTime', value)}
              />
            </div>
          </Form.Item>
        </div>
        <Form.Item label={'Event Details'} required>
          <div className={'input'}>
            <TextArea
              name={'eventDetails'}
              placeholder={
                'What the volunteer would do at the event would go here.'
              }
              value={eventDetails}
              onChange={e => handleValue(e.target.name, e.target.value)}
              style={{ height: 115 }}
            />
            {error && !eventDetails && (
              <span className="error-message error-span left-aligned">
                {error}
              </span>
            )}
          </div>
        </Form.Item>
        <Form.Item label={'Website'}>
          <div className={'input'}>
            <Input
              name={'website'}
              value={website}
              onChange={e => handleValue(e.target.name, e.target.value)}
            />
          </div>
        </Form.Item>
        <Form.Item label={'Other Notes'}>
          <div className={'input'}>
            <TextArea
              name={'otherNotes'}
              placeholder={'Any additional helpful tips for the event go here.'}
              value={otherNotes}
              onChange={e => handleValue(e.target.name, e.target.value)}
              style={{ height: 115 }}
            />
          </div>
        </Form.Item>
      </Form>
      <div className="buttonStyles">
        <StyledCancelButton
          key="cancel"
          type="secondary"
          onClick={() => handleForm()}
        >
          Cancel
        </StyledCancelButton>
        <StyledButton
          onClick={() => checkRequired()}
          key="save"
          type="primary"
          width="fit-content"
        >
          Save and Review
        </StyledButton>
      </div>
    </StyledDiv>
  );
};

const StyledButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-left: 60px;
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
`;

const StyledDiv = styled.div`
  .to-p-review {
    margin: 5px 20px 0px 45px;
  }
`;

export default CreateEventReviewEditForm;
