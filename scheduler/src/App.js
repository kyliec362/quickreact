import 'rbx/index.css';
import { Button, Container, Title } from 'rbx';
import React, { useState, useEffect } from 'react';

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const Banner = ({ title }) => (
  <Title>{ title || '[loading...]' }</Title>
);

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)

const buttonColor = selected => (
  selected ? 'success' : null
);
  
const Course = ({ course }) => (
  <Button>
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);

const TermSelector = ({ state }) => (
  <Button.Group hasAddons>
  { Object.values(terms)
      .map(value => 
        <Button key={value}
          color={ buttonColor(value === state.term) }
          onClick={ () => state.setTerm(value) }
          >
          { value }
        </Button>
      )
  }
  </Button.Group>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const termCourses = courses.filter(course => term === getCourseTerm(course));
  return (
    <React.Fragment>
      <TermSelector state={ { term, setTerm } } />
      <Button.Group>
        { termCourses.map(course => <Course key={ course.id } course={ course } state={ { term, setTerm } } />) }
      </Button.Group>
    </React.Fragment>
  );
};

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  //const url = 'https://www.cs.northwestern.edu/academics/courses/394/data/cs-courses.php';
  const url = '/data/cs-courses.json';
  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(json);
    }
    fetchSchedule();
  }, [])

  return (
    <Container>
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </Container>
  );
};

export default App;
