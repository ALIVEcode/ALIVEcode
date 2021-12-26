import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import api from "../../Models/api";
import { Post } from "../../Models/Forum/post.entity";
import NavBarSocial from "./NavBarSocial";
import { SearchProps } from "./searchType";

const SearchForum = (props: SearchProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
		const getPosts = async () => {
			const data = await api.db.forum.getPost({});
            setPosts(data);
            
		};
		getPosts();
        setSearch(props.match.params.id);
	}, [props.match.params.id])

    function filteredPost() {
        let post = posts;
        if (search !== 'search') {
            post = post.filter((post) => post.title.toLowerCase() === search.toLowerCase())
        }
        
        return post;
      }

    return (
       <>
        <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
        <NavBarSocial/>
        <CardContainer asRow title={"Recherche : "}>
        { posts &&
            filteredPost().map((post, idx) => {
            return (
                <Card style={{ width: '20rem' }} className='mt-3 ml-2' key={idx}>
                    <Link to={'/forum/post/'+post.id}>
                    <Card.Title>{post.title}</Card.Title>
                    </Link>
                    <Card.Footer >{post.created_at +" "+ post.creator.email}</Card.Footer>
                </Card>
            )
            })
        }
        </CardContainer>
        </CenteredContainer>
       </>
    )
};

export default SearchForum;