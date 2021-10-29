import "./Search.css";
import { SearchListItemDisplayComponent } from "../../Components/Helpers/GeneralHelpers";
import { Link } from "react-router-dom";

const SearchListItem = (props) => {
  const { note } = props;
  const pageReload = () => {
    console.log(window.location.href.split("/"));
    if (window.location.href.split("/").at(-1).split("-")[0] === "note") {
      console.log("Refreshed!!!");
      setTimeout(() => window.location.reload(), 10);
    }
  };
  return (
    <Link
      to={`/note-${note.id}`}
      // className="Note"
      style={{ textDecoration: "none" }}
      onClick={pageReload}
    >
      <SearchListItemDisplayComponent item={note} />
    </Link>
  );
};

export default SearchListItem;
