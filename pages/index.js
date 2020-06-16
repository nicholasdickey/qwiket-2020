import styled from "styled-components";
import withApollo from "../lib/apollo";
import Typography from "@material-ui/core/Typography";
import { Editions } from "../components/editions";
const StyledVerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 40px;
    padding-bottom: 40px;
    justify-content: center;
    width: 100%;
    height: 100%;
`;
const StyledHorizontalWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;
const Logo = styled.img`
    width: 300px;
`;
const Home = props => (
    <div>
        <StyledVerticalWrapper>
            <StyledHorizontalWrapper>
                <Typography variant="h1">Qwiket 20/20</Typography>
            </StyledHorizontalWrapper>
            <StyledHorizontalWrapper>
                <Logo src="/img/qwiket-top-logo.png" />
            </StyledHorizontalWrapper>
        </StyledVerticalWrapper>

        <Editions
            onSelect={v => (window.location = v)}
            open={true}
            {...props}
        />
    </div>
);

export default withApollo({ ssr: true })(Home);
