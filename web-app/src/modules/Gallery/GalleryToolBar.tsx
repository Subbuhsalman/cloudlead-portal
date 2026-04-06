import React, { useEffect, useState } from "react";
import { useGalleryHook } from "./GalleryHook";
import { useTranslation } from 'react-i18next';
import { Toolbar as ToolBarPrime } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

type Props = {
  newBtn: () => void;
  heading: string;
  btnHide: boolean;
  showSearchFilter: boolean;
  layoutType?: string;
  showLayoutBtns?: boolean;
  changeLayout?: (layout:string) => void;
};
const GalleryToolBar = (props: Props | any) => {
  const { t, i18n } = useTranslation();
  const {

    newBtn =() => {},
  changeLayout = () => {},
  isDisabled= true,
  btnHide= false,
  showLayoutBtns= true,
  showSearchFilter = true,
  heading= "",
  label= "Gallery",
  layoutType= "table",
  } = props;

  const {
    getPaginatedGalleryList,
    updateGalleryPaginationFilterSearch,
    GalleryLoading,
    GalleryFilter,
  } = useGalleryHook();
  const [searhValue, setSearhValue] = useState<any>("");

  const Refresh = () => {
    getPaginatedGalleryList();
  };
  /**
   * Handler for setting serach text
   * @param event
   */
  const changeSearchInputValue = (event: any) => {
    setSearhValue(event.target.value);
  };

  /**
   * Handles the user dynamic input text search
   */
  const searchHandler = () => {
    updateGalleryPaginationFilterSearch({
      filter: searhValue,
      page: 1,
      per_page: 10,
      sort: "gallery.created_at|desc",
    });
  };

  /**
   * Handler for clearing the search text
   */
  const onPressClear = () => {
    setSearhValue("");

    updateGalleryPaginationFilterSearch({
      filter: "",
      page: 1,
      per_page: 10,
      sort: "gallery.created_at|desc",
    });
  };

  useEffect(() => {
    if (!GalleryLoading) {
      getPaginatedGalleryList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GalleryFilter]);

  /**
   * Toolbar left content
   */
  const leftContents = (
    <React.Fragment>
      {heading && (
        <div style={{ width: "350px" }}>
          <h3 className="mr-5 mb-0">
            <i className={`mx-2 text-bold pi-fs-2 pi`} />
            {heading}
          </h3>
        </div>
      )}
    </React.Fragment>
  );

  /**
   * Toolbar right content
   */
  const rightContents = (
    <React.Fragment>
      {!btnHide && (
        <Button
     
          onClick={newBtn}
          label={label}
          icon="pi pi-plus"
          className="mr-2 p-button-primary"
          disabled={GalleryLoading}
        />
      )}

      <React.Fragment>
        <Button
         text
          icon="pi pi-refresh"
          className=" p-button-info right-spacing"
          aria-label="Bookmark"
          onClick={Refresh}
          tooltip="Reload Table" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
          disabled={GalleryLoading}
        />
      </React.Fragment>

      {showLayoutBtns && (
        <React.Fragment>
          <span className="p-buttonset">
            <Button
              text
              className={`${layoutType === "table" ? "button-low-opac" : ""}`}
              icon="pi pi-th-large"
              onClick={() => changeLayout("grid")}
              tooltip="Grid view" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
              disabled={GalleryLoading}
            />
            <Button
               text
              className={`${layoutType === "grid" ? "button-low-opac" : ""}`}
              icon="pi pi-bars"
              onClick={() => changeLayout("table")}
              tooltip="Table view" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
              disabled={GalleryLoading}
            />
          </span>
        </React.Fragment>
      )}
      {showSearchFilter && !GalleryLoading && (
        <React.Fragment>
          <span className="p-input-icon-right">
            {searhValue ? (
              <i className="pi pi-times" onClick={() => onPressClear()} />
            ) : (
              <></>
            )}

            <InputText
              value={searhValue}
              onChange={(event) => changeSearchInputValue(event)}
              placeholder={t('Type here to search')}
              onKeyDown={ ( event: any ) => {
                if ( event.key === "Enter" ) {
                  searchHandler();
                }
              } }
              disabled={GalleryLoading}
            />
          </span>
          <Button
           text
            icon="pi pi-search"
            className="mr-2"
            onClick={() => searchHandler()}
            disabled={GalleryLoading}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );

  return (
    <>
      <ToolBarPrime
        className="tool-bar mb-3"
        start={leftContents}
        end={rightContents}
      />
    </>
  );
};



export { GalleryToolBar };
