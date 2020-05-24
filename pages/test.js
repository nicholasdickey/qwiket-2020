import withData from "../lib/apollo";
import FeedEditor from "../components/feedEditor";
export default withData(props => {
    return (
        <div>
            <FeedEditor />
        </div>
    );
});
