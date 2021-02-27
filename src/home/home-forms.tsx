import React from "react";
import { homeState } from "./home-forms.types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { homeFormStyles } from "./home-forms.styles";
import { StringConst } from "../constants/string.constant";
import Typography from "@material-ui/core/Typography";
import { saveAs } from "file-saver";
import { isMobile } from "react-device-detect";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Home() {
  const classes = homeFormStyles();
  const baseState: homeState = {
    showAdddtional: false,
    loading: false,
    downloadFormat: StringConst.downloadFormats[0],
    url: "",
    imageUrl: "",
    width: "",
    height: "",
  };
  const [state, setState] = React.useState(baseState);
  const handleChange = (event: React.ChangeEvent<any>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked || event.target.value,
    });
  };
  const handleSubmit = () => {
    setState({
      ...state,
      loading: true,
    });
    const imageUrl = `${process.env.REACT_APP_CAPTURE_URL}/${
      process.env.REACT_APP_CAPTURE_URL_KEY
    }/urlscreenshot=agent:${isMobile ? "mobile" : "desktop"}${
      state.showAdddtional
        ? `${state.height && state.width ? `,mode:window` : ""}${
            state.height ? `,height:${state.height}` : ""
          }${state.width ? `,width:${state.width}` : ""}`
        : ""
    }/${state.url}`;
    fetch(imageUrl).then(
      (result) => {
        if (result.status !== 200) {
          alert(`Error ${result.status}`);
          setState({
            ...state,
            loading: false,
          });
        } else {
          setState({
            ...state,
            imageUrl: imageUrl,
            loading: false,
          });
          saveAs(
            imageUrl,
            `${state.url}.${state.downloadFormat.toLowerCase()}`
          );
        }
      },
      (error) => {}
    );
  };

  return (
    <form className={classes.form} noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label={StringConst.urlExample}
        name="url"
        autoComplete="url"
        autoFocus
        value={state.url}
        onChange={handleChange}
      />
      <Grid container justify="space-between">
        <Grid item>
          <Switch
            checked={state.showAdddtional}
            onChange={handleChange}
            name="showAdddtional"
          />
          <FormHelperText>
            {state.showAdddtional
              ? StringConst.hideAdditional
              : StringConst.showAdditional}
          </FormHelperText>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="contained"
            color="default"
            startIcon={<ClearAllIcon />}
            onClick={() => setState(baseState)}
          >
            {StringConst.clearAll}
          </Button>
        </Grid>
      </Grid>
      {state.showAdddtional && (
        <FormGroup row>
          <Grid container spacing={5}>
            <Grid item>
              <FormControl>
                <Input
                  value={state.width}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">px</InputAdornment>
                  }
                  type="number"
                  name="width"
                />
                <FormHelperText>{StringConst.setWidth}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <Input
                  value={state.height}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">px</InputAdornment>
                  }
                  type="number"
                  name="height"
                />
                <FormHelperText>{StringConst.setHeight}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={(classes.formControl, classes.marginTop)}>
                <Select
                  value={state.downloadFormat}
                  onChange={handleChange}
                  name="downloadFormat"
                >
                  {StringConst.downloadFormats.map((value, index) => (
                    <MenuItem value={value} key={index}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{StringConst.chooseFormat}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </FormGroup>
      )}
      <div className={classes.wrapper}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          endIcon={<PhotoCamera />}
          disabled={state.loading || !state.url}
          onClick={handleSubmit}
        >
          {StringConst.takeScreenshot}
        </Button>
        {state.loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
      {state.imageUrl && state.url && (
        <Grid container direction="row">
          <Typography component="h6" variant="h6" align="left">
            {StringConst.preview}
          </Typography>
          <img className={classes.imgResponsive} src={state.imageUrl} />
        </Grid>
      )}
    </form>
  );
}
