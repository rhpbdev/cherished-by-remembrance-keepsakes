"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import {
	CircleCheckIcon,
	InfoIcon,
	TriangleAlertIcon,
	OctagonXIcon,
	Loader2Icon,
	XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A global manager so `toast(...)` can be called from anywhere — event handlers,
 * hooks, plain modules — the way sonner's module-level `toast` used to work.
 * It is wired to the React tree by <Toaster />.
 */
const toastManager = BaseToast.createToastManager();

type ToastAction = {
	label: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ToastOptions = {
	/** Reusing an id updates that toast in place instead of stacking a new one. */
	id?: string;
	description?: React.ReactNode;
	/** Milliseconds before auto-dismiss. `0` keeps the toast until dismissed. */
	duration?: number;
	action?: ToastAction;
	/** `high` interrupts screen readers instead of announcing politely. */
	priority?: "low" | "high";
	onClose?: () => void;
};

function add(
	type: string | undefined,
	message: React.ReactNode,
	{ action, duration, ...options }: ToastOptions = {},
) {
	return toastManager.add({
		...options,
		type,
		title: message,
		timeout: duration,
		actionProps: action
			? { children: action.label, onClick: action.onClick }
			: undefined,
	});
}

const emit =
	(type?: string) =>
	(message: React.ReactNode, options?: ToastOptions) =>
		add(type, message, options);

export const toast = Object.assign(emit(), {
	success: emit("success"),
	error: emit("error"),
	warning: emit("warning"),
	info: emit("info"),
	loading: (message: React.ReactNode, options?: ToastOptions) =>
		add("loading", message, { duration: 0, ...options }),
	/** Omitting the id dismisses every toast. */
	dismiss: (id?: string) => toastManager.close(id),
	promise: toastManager.promise,
	update: toastManager.update,
});

const ICONS: Record<string, React.ReactNode> = {
	success: <CircleCheckIcon className='size-4 text-green-600' />,
	info: <InfoIcon className='size-4 text-blue-600' />,
	warning: <TriangleAlertIcon className='size-4 text-amber-600' />,
	error: <OctagonXIcon className='size-4 text-destructive' />,
	loading: <Loader2Icon className='size-4 animate-spin' />,
};

export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

/**
 * Swiping toward the screen edge the toasts are anchored to is the gesture that
 * feels like throwing them away, so the allowed directions follow the position.
 */
function swipeDirections(position: ToastPosition) {
	const vertical = position.startsWith("top") ? "up" : "down";
	const horizontal = position.endsWith("left") ? "left" : "right";
	return position.endsWith("center")
		? ([vertical, "left", "right"] as const)
		: ([vertical, horizontal] as const);
}

function ToastList({ position }: { position: ToastPosition }) {
	const { toasts } = BaseToast.useToastManager();

	return toasts.map((toast) => (
		<BaseToast.Root
			key={toast.id}
			toast={toast}
			swipeDirection={[...swipeDirections(position)]}
			className={cn(
				"toast-root",
				"overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg",
			)}
		>
			<BaseToast.Content className='toast-content flex items-start gap-3 p-4'>
				{toast.type && ICONS[toast.type] ? (
					<span className='mt-0.5 shrink-0'>{ICONS[toast.type]}</span>
				) : null}
				<div className='flex min-w-0 flex-1 flex-col gap-1'>
					<BaseToast.Title className='text-sm leading-tight font-medium' />
					<BaseToast.Description className='text-sm leading-snug text-muted-foreground' />
				</div>
				<BaseToast.Action className='shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground' />
				<BaseToast.Close
					aria-label='Close'
					className='shrink-0 rounded-md p-0.5 text-muted-foreground opacity-70 transition-opacity hover:opacity-100'
				>
					<XIcon className='size-4' />
				</BaseToast.Close>
			</BaseToast.Content>
		</BaseToast.Root>
	));
}

export type ToasterProps = {
	position?: ToastPosition;
	/** Default milliseconds before auto-dismiss. `0` disables it. */
	timeout?: number;
	/** Toasts past this count collapse behind the stack rather than unmounting. */
	limit?: number;
};

export function Toaster({
	position = "bottom-right",
	timeout,
	limit,
}: ToasterProps) {
	return (
		<BaseToast.Provider toastManager={toastManager} timeout={timeout} limit={limit}>
			<BaseToast.Portal>
				<BaseToast.Viewport data-position={position} className='toast-viewport'>
					<ToastList position={position} />
				</BaseToast.Viewport>
			</BaseToast.Portal>
		</BaseToast.Provider>
	);
}
