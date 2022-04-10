import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

const CampaignDeleteDialog = ({ id, isOpen, onClose, cancelRef }) => {
  const router = useRouter();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete campaign
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can\'t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                const res = await axios.delete("/api/campaign", {
                  data: { id },
                });
                const status = await res.status;
                if (status === 200) {
                  router.replace("/campaign");
                }
              }}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CampaignDeleteDialog;
