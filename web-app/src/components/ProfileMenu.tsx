import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { User, Settings, FileText, LogOut } from "lucide-react";  // or your favorite icon set
import { useBrandOnboarding, useLoginDetails } from "@/hooks";
import { SettingsModals } from "./Modals";

export const ProfileMenu = () => {
    const optionMenu = useRef<any>(null);
    const { userDetail, removeUserInfo } = useLoginDetails()
    const { ProfileModal, SettingsModal, BillingModal, BrandOnboardingModal } = SettingsModals()
    const { showOnboardingModal, handleOnboardingComplete, handleSkipOnboarding } = useBrandOnboarding();
    const [modals, setModals] = useState({
        profileModal: false,
        settingsModal: false,
        billingModal: false
    })

    const secondActions = [

        { icon: <LogOut size={16} className="text-red-500" />, label: "Logout", onClick: () => removeUserInfo() },
    ];

    const items = [
        { icon: <User size={16} />, label: "My Profile", onClick: () => setModals((prev) => ({ ...prev, profileModal: true })) },
        { icon: <Settings size={16} />, label: "Settings", onClick: () => setModals((prev) => ({ ...prev, settingsModal: true })) },
        { icon: <FileText size={16} />, label: "Plan & Billing", onClick: () => setModals((prev) => ({ ...prev, billingModal: true })) },
    ];

    const RenderItem = (props: any) => {
        const { onClick, label, icon } = props.item;
        return (<li
            key={props.i}
            onClick={onClick}
            className={`
                flex items-center text-[#494949] gap-2 mx-1 my-1 px-3 py-2 rounded-lg text-md transition 
                ${label === "Logout" ? "hover:bg-red-50" : "hover:bg-[#EFEFEF]"} 
                ${label === "Logout" ? "text-red-600" : "text-gray-800"} 
                cursor-pointer
              `}
        >
            <span className="text-gray-500">{icon}</span>
            <span className="flex-1 text-[#494949]">{label}</span>
        </li>)
    }
    return (
        <>
            <BillingModal visible={modals.billingModal} closeModal={() => { setModals((prev) => ({ ...prev, billingModal: false })) }} />
            <SettingsModal visible={modals.settingsModal} closeModal={() => { setModals((prev) => ({ ...prev, settingsModal: false })) }} />
            <ProfileModal visible={modals.profileModal} closeModal={() => { setModals((prev) => ({ ...prev, profileModal: false })) }} />
            <BrandOnboardingModal
                isOpen={showOnboardingModal}
                onClose={handleSkipOnboarding}
                onComplete={handleOnboardingComplete}
            />

            <div
                onClick={e => optionMenu.current.toggle(e)}
                className="flex items-center gap-2 cursor-pointer "
            >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#000] text-xs font-medium">M</span>
                </div>
                <span className="text-sm text-white font-medium">{userDetail?.userDetail?.name}</span>
            </div>

            <OverlayPanel
                ref={optionMenu}
                className="p-1 mt-2 rounded-2xl shadow-2xl border-2 border-[#CFCFCF] overflow-hidden bg-white"
            >
                <ul className="flex flex-col w-50 border-b border-gray-200">
                    {items.map((item: any, i) => {
                        return (
                            <RenderItem key={`${item.label}`} item={item} i={i} />
                        )
                    })}
                </ul>

                <ul className="flex flex-col w-50 border-b border-gray-50">
                    {secondActions.map((item: any, i) => {
                        return (
                            <RenderItem key={`${item.label}`} item={item} i={i} />
                        )
                    })}
                </ul>
            </OverlayPanel>




        </>
    );
};
