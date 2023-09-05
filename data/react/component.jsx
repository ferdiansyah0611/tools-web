import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";

export default function $name() {
  const dispatch = useDispatch();
  return (
    <div>
      <p>this is $name component</p>
    </div>
  );
}
