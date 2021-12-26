import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import SmallCard from "../../Components/UtilsComponents/Cards/SmallCard/SmallCard";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import api from "../../Models/api";
import { CategorySubject } from "../../Models/Forum/categorySubject.entity";

const CategoriesForum = () => {
	const [category, setCategory] = useState<CategorySubject[]>([]);

	useEffect(() => {
		const getCategory = async () => {
			const data = await api.db.forum.categories.get({});
			setCategory(data.map((d: any) => plainToClass(CategorySubject, d)))
		};
		getCategory();
	}, [])

return (
    <div>
        <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
            <CardContainer asRow title="Catégories">
			{category.map((c, idx) =>
            <SmallCard
						to={"/forum/subjectList/"+c.id}
						title={c.name}
						//img={List}
						key={idx}
						style={{ width: '22rem', height: '10rem' }}
					/>	
			)}
            </CardContainer>

        </CenteredContainer>
    </div>
)
}

export default CategoriesForum;
