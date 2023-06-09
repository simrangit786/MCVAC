import React, { useCallback, useState } from "react";
import CreatePostsDrawer from "../../drawers/CreatePostsDrawer";
import OpportunityPosts from "./SummaryInfo/OpportunityPosts";

const OpportunityPostTab = () => {
  const [visible, setVisible] = useState(false)

  const showPostDrawer = (visible) => {
    setVisible(visible)
  };

  return (
      <React.Fragment>
        <div className="row mx-0 mt-30 no-data-card-row-new">
          <OpportunityPosts hideTitle viewAll/>
        </div>
        <CreatePostsDrawer
          visible={visible}
          onClose={() => showPostDrawer(false)}
        />
      </React.Fragment>
    );
}

export default OpportunityPostTab;
