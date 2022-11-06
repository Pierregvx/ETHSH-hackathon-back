import type { ImageSource } from "@/common/types";
import failSvg from "@static/fail.svg";
import spinnerSvg from "@static/spinner.svg";
import wrongChain from "@static/wrong-chain.svg";
import type { ReactNode } from "react";
import { Fragment } from "react";

export type ModalContent = {
  icon: ImageSource;
  status: string;
  description?: ReactNode | string;
  button?: string;
};

type Variants = "confirmation" | "fail" | "pending" | "wrongChainId";

export const modalVariants: { [key in Variants]: ModalContent } = {
  confirmation: {
    icon: spinnerSvg,
    status: "Waiting for confirmation",
    description:
      "We’ve established a connection to your wallet, now please confirm the signature request.",
  },
  fail: {
    icon: failSvg,
    status: "Something went wrong!",
    description:
      "Sorry, looks like something went wrong there. Please try again or come back later.",
    button: "OK",
  },
  pending: {
    icon: spinnerSvg,
    status: "Please wait...",
  },
  wrongChainId: {
    icon: wrongChain,
    status: "Please switch to Mumbai chain",
    description: (
      <Fragment>
        Looks like you connected a wallet on a different chain. Please switch to{" "}
        Polygon Mumbai Testnet. <br />
        <a
          className="text-df57bc transition-opacity hover:opacity-75"
          href="https://docs.polygon.technology/docs/develop/network-details/network/"
          target="_blank"
          rel="noreferrer"
        >
          How to connect?
        </a>
      </Fragment>
    ),
    button: "OK",
  },
};
