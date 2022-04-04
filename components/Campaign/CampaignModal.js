import { useEffect, useReducer, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import CampaignInfo from "./Carousel/CampaignInfo";
import { Switch, Case } from "react-if";
import CampaignTarget from "./Carousel/CampaignTarget";
import CampaignAssignments from "./Carousel/CampaignAssignments";
import axios from "axios";

const modalTitles = {
  0: "Create new campaign",
  1: "Campaign focus",
  2: "Assignments",
};

const CampaignModal = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [campaignForm, setCampaignForm] = useState({
    campaignName: "",
    campaignDescription: "",
    campaignStartDate: null,
  });
  const [counties, setCounties] = useState([]);
  const [legislators, setLegislators] = useState([]);

  const decrementPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(async () => {
    const res = await axios.get("/api/campaign");
    setCounties(res.data.counties);
    setLegislators(res.data.legislators);
  }, []);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitles[currentPage]}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Switch>
            <Case condition={currentPage === 0}>
              <CampaignInfo
                incrementPage={incrementPage}
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
              />
            </Case>
            <Case condition={currentPage === 1}>
              <CampaignTarget
                decrementPage={decrementPage}
                incrementPage={incrementPage}
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
                counties={counties}
                setCounties={setCounties}
                legislators={legislators}
                setLegislators={setLegislators}
              />
            </Case>
            <Case condition={currentPage === 2}>
              <CampaignAssignments decrementPage={decrementPage} />
            </Case>
          </Switch>
        </ModalBody>
      </ModalContent>
      {/* Footer can't go here because submit button must be within Formik form tag */}
    </Modal>
  );
};

export default CampaignModal;
