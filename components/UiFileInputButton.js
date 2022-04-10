import React, {useRef} from 'react';
  export const UiFileInputButton = (props) => {
    const fileInputRef = useRef(null);
    const formRef = useRef(null);
  
    const onClickHandler = () => {
      fileInputRef.current?.click();
    };
  
    const onChangeHandler = (event) => {
      if (!event.target.files?.length) {
        return;
      }
  
      const formData = new FormData();
  
      Array.from(event.target.files).forEach((file) => {
        formData.append(event.target.name, file);
      });
  
      props.onChange(formData);
  
      formRef.current?.reset();
    };
  
    return (
      <form ref={formRef} style={{backgroundColor: "gray", padding: "7.5px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "4px", marginRight: "8px"}}>
        <button type="button" onClick={onClickHandler} style={{color: "white", fontWeight: "500"}}>
          {props.label}
        </button>
        <input
          accept={props.acceptedFileTypes}
          multiple={props.allowMultipleFiles}
          name={props.uploadFileName}
          onChange={onChangeHandler}
          ref={fileInputRef}
          style={{ display: 'none' }}
          type="file"
        />
      </form>
    );
  };
  
  UiFileInputButton.defaultProps = {
    acceptedFileTypes: '',
    allowMultipleFiles: false,
  };