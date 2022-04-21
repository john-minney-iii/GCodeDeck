import { useState } from "react";
import Navbar from "../components/navbar";
import { Modal } from "react-bootstrap";
import axios from "axios";

// Components
import DrillingFormModal from "../components/gen-home-modals/drilling-modal";
import SpindleCommandForm from "../components/gen-home-modals/spindle-form-modal";
import ToolChangeForm from "../components/gen-home-modals/tool-change-modal";
import RapidForm from "../components/gen-home-modals/rapid-movement-modal";
import LinearForm from "../components/gen-home-modals/linear-movement-modal";
import FacingTemplateForm from "../components/gen-home-modals/facing-template-modal";


export default function GenHome(props) {
    const [gcodeList, setGcodeList] = useState([]);         // Gcode data struct
    const [lastBlockUndo, setLastBlockUndo] = useState();   // Used for redo
    const [lastBlock, setLastBlock] = useState();           // Used to copy last operation

    // States for modals
    const [rapidModalShow, setrapidModalShow] = useState(false);
    const [linearModalShow, setlinearModalShow] = useState(false);
    const [spindleModalShow, setSpindleModalShow] = useState(false);
    const [drillModalShow, setDrillModalShow] = useState(false);
    const [toolChangeModalShow, setToolChangeModalShow] = useState(false);
    const [facingTemplateModalShow, setFacingTemplateModalShow] = useState(false);

    // Used for server posts
    const [baseUrl, setBaseUrl] = useState(
        (props.prod) ? 'https://minn4519.pythonanywhere.com' : 'http://localhost:8000'
    );

    const handleModal = (which) => {
        if (which === 'linearModal')
            setlinearModalShow(!linearModalShow);
        else if (which === 'rapidModal')
            setrapidModalShow(!rapidModalShow);
        else if (which === 'drillModal')
            setDrillModalShow(!drillModalShow);
        else if (which === 'spindleModal')
            setSpindleModalShow(!spindleModalShow);
        else if (which === 'toolChangeModal')
            setToolChangeModalShow(!toolChangeModalShow);
        else if (which === 'facingTemplateModal')
            setFacingTemplateModalShow(!facingTemplateModalShow);
    };

    // Functions for Gcode Data Struct ---------------------------------

    const addGcodeBlock = (block) => {
        if (gcodeList.length !== 0) {
            let tempGcode = [...gcodeList];
            tempGcode.push(block);
            setGcodeList(tempGcode);
        } else {
            setGcodeList([block]);
        }
        setLastBlock(block);
    };

    const PrintGcode = () => {
        let gcodeString = '';
        gcodeList.forEach((block) => {
            block.split(',').forEach((line) => gcodeString = gcodeString + line + '\n');
        });
        return <div>
            <textarea
                value={gcodeString}
                rows={20}
                cols={75}
            />
        </div>;
    };

    const gcodeUndo = () => {
        let tempGcode = [...gcodeList];
        setLastBlockUndo(tempGcode.pop());
        setGcodeList(tempGcode);
    };

    const gcodeRedo = () => {
        if (lastBlockUndo) {
            let tempGcode = [...gcodeList];
            tempGcode.push(lastBlockUndo);
            setGcodeList(tempGcode);
        }
    };

    const gcodeCopy = () => {
        let gcodeString = '';
        gcodeList.forEach((block) => {
            block.split(',').forEach((line) => gcodeString = gcodeString + line + '\n');
        });
        navigator.clipboard.writeText(gcodeString);
    };

    const gcodeClear = () => {
        setGcodeList([]);
        setLastBlockUndo();
        setLastBlock();
    };

    const gcodeCopyLast = () => {
        if (lastBlock) {
            let tempGcode = [...gcodeList];
            tempGcode.push(lastBlock);
            setGcodeList(tempGcode);
        }
    };

    // Form Submit Functions --------------------------------------------- 

    const toolChangeFormSubmit = (toolNumber, cutterCompensation, toolNotes) => {
        if (toolNumber !== '' || cutterCompensation !== '' || toolNotes !== '') {
            axios.post(baseUrl + '/api/v1/gcode/toolChange/', {
                'toolNumber': toolNumber,
                'cutterCompensation': cutterCompensation,
                'notes': toolNotes
            }).then(res => { // flag
                if (res.status === 200)
                    addGcodeBlock(res.data)
            });
        }
    };

    const spindleCommandFormSubmit = (spindleDirection, spindleRPM) => {
        axios.post(baseUrl + '/api/v1/gcode/spindleCommand/', {
            'directionOfRotation': spindleDirection,
            'spindleRpm': spindleRPM
        }).then(res => { // flag
            if (res.status === 200)
                addGcodeBlock(res.data)
        });
    };

    const DrillingFormModalSubmit = async (drillXPos, drillYPos, drillZPos, drillRef, drillPeckDepth, drillFeedRate) => {
        if (drillXPos !== '' || drillYPos !== '' || drillZPos !== '' || drillRef !== '' || drillPeckDepth !== ''|| drillFeedRate !== '') {
            let finished = false;
            axios.post(baseUrl + '/api/v1/gcode/drilling/', {//don't know
            'xPos': drillXPos,
            'yPos': drillYPos,
            'zPos': drillZPos,
            'reference': drillRef,
            'peckDepth': drillPeckDepth,
            'feedRate': drillFeedRate
            }).then(res => { // flag
                if (res.status === 200) {
                    addGcodeBlock(res.data)
                    finished = true;
                }
            }).then(res => {
                if (!finished) {
                    alert('Drill Form Not Filled Out Properly, Please try again');
                }
            });
        }
    };

    const rapidFormSubmit = async (rapidFeedRate, rapidChoice, rapidPos, rapidPos2) => {
        if (rapidFeedRate !== '' || rapidChoice !== '' || rapidPos !== ''|| rapidPos2 !== '') {
            axios.post(baseUrl + '/api/v1/gcode/rapidMovement/', {
                'feedrate': rapidFeedRate,
                'axis': rapidChoice,
                'pos': rapidPos,
                'pos2': rapidPos2
            }).then(res => { // flag
                if (res.status === 200)
                    addGcodeBlock(res.data)
            });
        }
    };

    const linearFormSubmit = async (linearFeedRate, linearChoice, linearPos, linearPos2) => {
        if (linearFeedRate !== '' || linearChoice !== '' || linearPos !== ''|| linearPos2 !== '') {
            axios.post(baseUrl + '/api/v1/gcode/linearMovement/', {
                'feedrate': linearFeedRate,
                'axis': linearChoice,
                'pos': linearPos,
                'pos2': linearPos2
            }).then(res => { // flag
                if (res.status === 200)
                    addGcodeBlock(res.data)
            })
        }
    };

    const facingTemplateFormSubmit = (facingDir, faceToolNumber, faceCutDiam, faceSpindleRPM, faceFeedRate, faceWidth, faceDepth, faceClearance, faceDOC, facePlunge, faceStepOver) => {
        if (facingDir !== '' || faceToolNumber !== '' || faceCutDiam !== ''|| faceSpindleRPM !== '' || faceFeedRate !== '' || faceWidth !== '' || faceDepth !== ''|| faceClearance !== '' || faceDOC !== '' || facePlunge !== '' || faceStepOver !== '') {
            axios.post(baseUrl + '/api/v1/gcode/facingTemplate/', {
                'faceDir': facingDir,
                'toolNumber': faceToolNumber,
                'cutterDiameter': faceCutDiam,
                'spindleRpm': faceSpindleRPM,
                'feedRate': faceFeedRate,
                'width': faceWidth,
                'depth': faceDepth,
                'clearance': faceClearance,
                'doc': faceDOC,
                'plungeRate': facePlunge,
                'stepOver': faceStepOver
            }).then(res => { // flag
                if (res.status === 200)
                    addGcodeBlock(res.data)
            });
        }
    };

    // Main Return ---------------------------------------------------------------------------------------------------------------------------
    return (
        <div className='gen-home'>
            <Navbar authenticated={props.authenticated} changeView={props.changeView} />
            <div className="m-5">
                <h2>GCODE Generation Home</h2>
                <div className="container-justify-content-start py-2" >
                    <div className="row">
                        <div className="col">
                            Tool Path Options
                        </div>
                        <div className="col-7 ">
                            Real-Time GCODE Generation
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <div className="toolChange-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('toolChangeModal')}
                                >
                                    Tool Change
                                </button>
                            </div>
                            <div className="spindleCommand-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('spindleModal')}
                                >
                                    Spindle Command
                                </button>
                            </div>
                            <div className="G00-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('rapidModal')}
                                >
                                    Rapid Movement (G00)
                                </button>
                            </div>
                            <div className="linear-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('linearModal')}
                                >
                                    Linear Movement (G01)
                                </button>
                            </div>
                            <div className="drilling-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('drillModal')}
                                >
                                    Drilling
                                </button>
                            </div>
                            <div className="facingTemplate-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('facingTemplateModal')}
                                >
                                    Facing Template
                                </button>
                            </div>
                            <div className="rectangleTemplate-button py-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-XL rounded-pill w-100"
                                    onClick={() => handleModal('rectangleTemplateModal')}
                                >
                                    Rectangle Template
                                </button>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="container-justify-content-start d-flex d-flex-inline">
                                {PrintGcode()}
                                <div className="ms-2">
                                    <button className="btn btn-primary rounded-pill mb-2 w-100" onClick={() => gcodeClear()}>Clear</button>
                                    <button className="btn btn-primary rounded-pill mb-2 w-100" onClick={() => gcodeUndo()}>Undo</button>
                                    <button className="btn btn-primary rounded-pill mb-2 w-100" onClick={() => gcodeRedo()}>Redo</button>
                                    <button className="btn btn-primary rounded-pill mb-2 w-100" onClick={() => gcodeCopy()}>Copy</button>
                                    <button className="btn btn-primary rounded-pill mb-2 w-100" onClick={() => gcodeCopyLast()}>Copy Last</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={linearModalShow} onHide={() => handleModal('linearModal')}>
                <Modal.Header closeButton>
                    Linear Movement
                </Modal.Header>
                <Modal.Body>
                    {LinearForm()}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('linearModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('linearModal');
                            linearFormSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>

            <Modal show={toolChangeModalShow} onHide={() => handleModal('toolChangeModal')}>
                <Modal.Header closeButton>
                    Tool Change
                </Modal.Header>
                <Modal.Body>
                    {ToolChangeForm()}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('toolChangeModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('toolChangeModal');
                            toolChangeFormSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>

            <Modal show={rapidModalShow} onHide={() => handleModal('rapidModal')}>
                <Modal.Header closeButton>
                    Rapid Movement
                </Modal.Header>
                <Modal.Body>
                    {RapidForm()}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('rapidModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('rapidModal');
                            rapidFormSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>

            <Modal show={facingTemplateModalShow} onHide={() => handleModal('facingTemplateModal')}>
                <Modal.Header closeButton>
                    Facing Template
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                {FacingTemplateForm()}
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('facingTemplateModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('facingTemplateModal');
                            facingTemplateFormSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>

            <Modal show={drillModalShow} onHide={() => handleModal('drillModal')}>
                <Modal.Header closeButton>
                    Peck Drilling
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                {DrillingFormModal()}
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('drillModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('drillModal');
                            DrillingFormModalSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>

            <Modal show={spindleModalShow} onHide={() => handleModal('spindleModal')}>
                <Modal.Header closeButton>
                    Spindle Command
                </Modal.Header>
                <Modal.Body>
                    {SpindleCommandForm()}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => handleModal('spindleModal')}
                    >Cancel</button>
                    <button
                        className='btn btn-primary btn-lg rounded-pill'
                        onClick={() => {
                            handleModal('spindleModal');
                            spindleCommandFormSubmit();
                        }}
                    >Submit</button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}
