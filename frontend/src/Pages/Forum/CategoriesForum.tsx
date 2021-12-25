import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import SmallCard from "../../Components/UtilsComponents/Cards/SmallCard/SmallCard";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";

const CategoriesForum = () => {
return (
    <div>
        <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
            <CardContainer asRow title="Catégories">
            <SmallCard
						//to={routes.auth.level_list.path}
						title="Getdata"
						//img={List}
					/>
            </CardContainer>

        </CenteredContainer>
    </div>
)
}

export default CategoriesForum;
