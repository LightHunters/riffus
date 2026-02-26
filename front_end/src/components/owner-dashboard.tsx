"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderDTO, OrderStatus } from "@/modules/orders/types";
import { UserDTO } from "@/modules/users/types";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export function OwnerDashboard() {
  const [owner, setOwner] = useState<UserDTO | null>(null);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [toast, setToast] = useState("");
  const headers = useMemo(() => ({ "content-type": "application/json" }), []);

  async function loadOrders() {
    const res = await fetch("/api/orders", { cache: "no-store" });
    const payload = (await res.json()) as ApiResponse<OrderDTO[]>;
    setOrders(payload.data ?? []);
  }

  useEffect(() => {
    async function boot() {
      const userRes = await fetch("/api/users/demo?role=owner", { cache: "no-store" });
      const userPayload = (await userRes.json()) as ApiResponse<UserDTO>;
      setOwner(userPayload.data);
      await loadOrders();
    }

    boot().catch(() => setToast("Failed to load owner dashboard"));
    const polling = setInterval(() => {
      loadOrders().catch(() => null);
    }, 6000);

    return () => clearInterval(polling);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    const payload = (await res.json()) as ApiResponse<OrderDTO>;
    if (!payload.success) {
      setToast(payload.message ?? "Failed to update status");
      return;
    }
    setToast("Queue updated");
    await loadOrders();
  }

  async function move(orderId: string, direction: "up" | "down") {
    const queued = orders.filter((order) => order.status === "queued");
    const idx = queued.findIndex((item) => item._id === orderId);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === queued.length - 1) return;

    const target = direction === "up" ? idx - 1 : idx + 1;
    const clone = [...queued];
    const [item] = clone.splice(idx, 1);
    clone.splice(target, 0, item);

    const orderedIds = clone.map((item2) => item2._id);
    const res = await fetch("/api/orders/reorder", {
      method: "POST",
      headers,
      body: JSON.stringify({ orderedIds }),
    });
    const payload = (await res.json()) as ApiResponse<{ reordered: boolean }>;
    if (!payload.success) {
      setToast(payload.message ?? "Failed to reorder queue");
      return;
    }
    setToast("Queue reordered");
    await loadOrders();
  }

  const queued = orders.filter((order) => order.status === "queued");
  const playing = orders.filter((order) => order.status === "playing");
  const completed = orders.filter((order) => order.status === "completed");

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-6">
      <header className="glass mb-4 rounded-2xl border border-white/10 p-4">
        <h1 className="m-0 text-2xl font-bold">Owner Dashboard</h1>
        <p className="mb-0 text-white/60">
          {owner ? `Signed in as ${owner.name}` : "Loading owner..."}
        </p>
        <div className="mt-3">
          <a href="/" className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15">
            Back to Customer App
          </a>
        </div>
      </header>

      <div className="queue-columns">
        <section className="glass rounded-2xl border border-white/10 p-3">
          <h3 className="px-1 text-lg font-semibold">Queued</h3>
          {queued.map((order) => (
            <article
              key={order._id}
              className="mt-2 grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl bg-[rgba(17,16,33,0.6)] p-2"
            >
              <img src={order.song.coverImage} alt={order.song.title} className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <strong>{order.song.title}</strong>
                <div className="text-sm text-white/60">{order.song.artist}</div>
                <small className="text-xs text-white/50">#{order.queuePosition}</small>
              </div>
              <div className="grid gap-1">
                <button className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/15" onClick={() => move(order._id, "up")}>
                  Up
                </button>
                <button className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/15" onClick={() => move(order._id, "down")}>
                  Down
                </button>
                <button className="rounded bg-[#6b5cff] px-2 py-1 text-xs text-white hover:opacity-90" onClick={() => updateStatus(order._id, "playing")}>
                  Play
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="glass rounded-2xl border border-white/10 p-3">
          <h3 className="px-1 text-lg font-semibold">Playing</h3>
          {playing.map((order) => (
            <article
              key={order._id}
              className="mt-2 grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl bg-[rgba(17,16,33,0.6)] p-2"
            >
              <img src={order.song.coverImage} alt={order.song.title} className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <strong>{order.song.title}</strong>
                <div className="text-sm text-white/60">{order.song.artist}</div>
              </div>
              <button className="rounded bg-[#6b5cff] px-3 py-2 text-xs text-white hover:opacity-90" onClick={() => updateStatus(order._id, "completed")}>
                Complete
              </button>
            </article>
          ))}
        </section>

        <section className="glass rounded-2xl border border-white/10 p-3">
          <h3 className="px-1 text-lg font-semibold">Completed</h3>
          {completed.map((order) => (
            <article
              key={order._id}
              className="mt-2 grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl bg-[rgba(17,16,33,0.6)] p-2"
            >
              <img src={order.song.coverImage} alt={order.song.title} className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <strong>{order.song.title}</strong>
                <div className="text-sm text-white/60">{order.song.artist}</div>
              </div>
              <button className="rounded bg-white/10 px-3 py-2 text-xs hover:bg-white/15" onClick={() => updateStatus(order._id, "queued")}>
                Re-queue
              </button>
            </article>
          ))}
        </section>
      </div>

      {toast ? (
        <div className="mt-4 rounded-lg bg-[#6b5cff]/30 px-4 py-2 text-violet-200 backdrop-blur">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
