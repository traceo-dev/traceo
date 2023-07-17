import { ApiResponse, MemberRole } from "@traceo/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { useAppDispatch } from "../../store";
import { setPermission } from "../../features/project/state/project/reducers";

type PermissionType = {
  role: MemberRole;
};

export const usePermission = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);

  const [role, setRole] = useState<MemberRole>(undefined);

  useEffect(() => {
    const fetchPermission = async () => {
      setLoading(true);
      await api
        .get<ApiResponse<PermissionType>>("/api/member/permission", {
          id
        })
        .then((resp) => {
          setRole(resp.data.role);
          dispatch(setPermission(resp.data.role));
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchPermission();
  }, [id]);

  return {
    isLoadingPerms: isLoading,
    hasPermission: role && role !== MemberRole.NONE,
    permission: role
  };
};
