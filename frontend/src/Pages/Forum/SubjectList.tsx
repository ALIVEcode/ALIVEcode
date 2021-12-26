import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import api from "../../Models/api";
import { CategorySubject } from "../../Models/Forum/categorySubject.entity";
import { Subject } from "../../Models/Forum/subjects.entity";
import NavBarSocial from "./NavBarSocial";
import { SubjectProps } from "./subjectTypes";
import { Link } from 'react-router-dom';


const SubjectList = (props: SubjectProps) => {
    const [category, setCategory] = useState<CategorySubject>();
    const [subject, setSubject] = useState<Subject[]>([]);


	useEffect(() => {
		const getSubject = async () => {
			const data = await api.db.forum.categories.getById({ id: props.match.params.id});
			const subjectdata = data.subjects;
            setSubject(subjectdata.map((d: any) => plainToClass(Subject, d)));
            setCategory(data);
            
		};
		getSubject();
	}, [props.match.params.id])

    return (
        <div>
        <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
        <NavBarSocial/>
        <CardContainer asRow title={"Liste des sujets de : "+ category?.name}>
        <Row>
        {subject.map((s, idx) =>
        <div key={idx}>
            <Col>
            <Card style={{ width: '25rem' }}>
                <Card.Header className="bg-secondary">
                    <Card.Title as="h5">{s.name}</Card.Title>
                </Card.Header>
                <ListGroup variant="flush">
                {s.posts.map((p, idx) => 
                <ListGroup.Item key={idx}>
                <Card>
                    <Link to={'/forum/post/'+s.id}>
                    <Card.Title>{p.title}</Card.Title>
                    </Link>
                    <Card.Footer >{p.created_at +" "+ p.creator.email}</Card.Footer>
                </Card>
                </ListGroup.Item>
                )}
                </ListGroup>
            </Card>
            </Col>
        </div>
        )}
        </Row>
        </CardContainer>
        </CenteredContainer>
        </div>
    );
};

export default SubjectList;
