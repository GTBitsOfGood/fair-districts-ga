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

  useEffect(async () => {
    const res = await axios.get("/api/campaign");
    setCounties(res.data.counties);
    setLegislators(res.data.legislators);
  }, []);

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitles[currentPage]}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Switch>
            <Case condition={currentPage === 0}>
              <CampaignInfo
                setCurrentPage={setCurrentPage}
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
              />
            </Case>
            <Case condition={currentPage === 1}>
              <CampaignTarget
                setCurrentPage={setCurrentPage}
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
                counties={counties}
                setCounties={setCounties}
                legislators={legislators}
                setLegislators={setLegislators}
              />
            </Case>
            <Case condition={currentPage === 2}>
              <CampaignAssignments setCurrentPage={setCurrentPage} />
            </Case>
          </Switch>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CampaignModal;
