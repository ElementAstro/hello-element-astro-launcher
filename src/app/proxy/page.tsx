"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

import { AppLayout } from "@/components/app-layout";
import type { Proxy, ProxyLog } from "@/types/proxy";
import { TranslationProvider, useTranslations } from "@/components/i18n";
import { proxyPageTranslations } from "./translations-loader";

import { ProxyHeader } from "@/components/proxy/proxy-header";
import { ProxySearchAndFilter } from "@/components/proxy/proxy-search-and-filter";
import { ProxyList } from "@/components/proxy/proxy-list";
import { DeleteProxyDialog } from "@/components/proxy/delete-proxy-dialog";
import { ProxyLogsDialog } from "@/components/proxy/proxy-logs-dialog";

export default function ProxyPage() {
  // 检测浏览器语言，设置为英文或中文
  const userLanguage = typeof navigator !== 'undefined' ? 
    (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US') : 'en-US';
  
  // 从用户区域确定地区
  const userRegion = userLanguage === 'zh-CN' ? 'CN' : 'US';
  
  return (
    <TranslationProvider 
      initialDictionary={proxyPageTranslations[userLanguage] || proxyPageTranslations['en-US']}
      lang={userLanguage.split('-')[0]}
      initialRegion={userRegion}
    >
      <ProxyPageContent />
    </TranslationProvider>
  );
}

function ProxyPageContent() {
  const { t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [proxyToDelete, setProxyToDelete] = useState<string | null>(null);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [selectedProxyLogs, setSelectedProxyLogs] = useState<ProxyLog[]>([]);

  // 从store获取全局加载状态
  const isLoading = false; // 临时写法，实际应该从store中获取

  // 模拟代理数据
  const [proxies, setProxies] = useState<Proxy[]>([
    {
      id: "proxy-1",
      name: "香港节点",
      description: "香港高速节点，适合访问国际网站",
      status: "running",
      type: "http",
      address: "hk.proxy.example.com:8080",
      latency: 85,
      logs: [
        {
          time: "2025-05-03T10:15:23.000Z",
          level: "info",
          message: "代理服务启动",
        },
        {
          time: "2025-05-03T10:15:25.000Z",
          level: "info",
          message: "连接已建立",
        },
      ],
    },
    {
      id: "proxy-2",
      name: "美国节点",
      description: "美国稳定节点，适合流媒体服务",
      status: "idle",
      type: "socks5",
      address: "us.proxy.example.com:1080",
      latency: 180,
      logs: [
        {
          time: "2025-05-02T18:23:12.000Z",
          level: "info",
          message: "代理服务已停止",
        },
      ],
    },
    {
      id: "proxy-3",
      name: "日本节点",
      description: "日本高速节点，适合游戏加速",
      status: "error",
      type: "http",
      address: "jp.proxy.example.com:8080",
      latency: 95,
      logs: [
        {
          time: "2025-05-03T09:15:23.000Z",
          level: "error",
          message: "连接失败，请检查网络设置",
        },
      ],
    },
  ]);

  // 过滤代理
  const filteredProxies = proxies.filter((proxy) => {
    const matchesSearch =
      proxy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proxy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proxy.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "running" && proxy.status === "running") ||
      (selectedTab === "idle" && proxy.status === "idle") ||
      (selectedTab === "error" && proxy.status === "error");

    return matchesSearch && matchesTab;
  });

  // 模拟操作函数
  const startProxy = (id: string) => {
    setProxies((prev) =>
      prev.map((proxy) =>
        proxy.id === id
          ? {
              ...proxy,
              status: "running",
              logs: [
                ...proxy.logs,
                {
                  time: new Date().toISOString(),
                  level: "info",
                  message: t('proxy.status.running'),
                },
              ],
            }
          : proxy
      )
    );
    toast.success(t('proxy.card.tooltips.start'));
  };

  const stopProxy = (id: string) => {
    setProxies((prev) =>
      prev.map((proxy) =>
        proxy.id === id
          ? {
              ...proxy,
              status: "idle",
              logs: [
                ...proxy.logs,
                {
                  time: new Date().toISOString(),
                  level: "info",
                  message: t('proxy.status.idle'),
                },
              ],
            }
          : proxy
      )
    );
    toast.success(t('proxy.card.tooltips.stop'));
  };

  const deleteProxy = () => {
    if (!proxyToDelete) return;
    setProxies((prev) => prev.filter((proxy) => proxy.id !== proxyToDelete));
    setIsDeleteDialogOpen(false);
    setProxyToDelete(null);
    toast.success(t('proxy.deleteDialog.confirm'));
  };

  const handleViewLogs = (proxy: Proxy) => {
    setSelectedProxyLogs(proxy.logs);
    setIsLogsDialogOpen(true);
  };

  const handleRefresh = () => {
    toast.success(t('proxy.search.placeholder'));
    // 实际应用中，这里会重新获取代理列表
  };

  const handleCreateProxy = () => {
    toast.info(t('proxy.list.addNew'));
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-auto pb-16 md:pb-0"
      >
        <div className="container py-6 space-y-6">
          <ProxyHeader
            onCreateProxy={handleCreateProxy}
          />

          <ProxySearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            onRefresh={handleRefresh}
          />

          <ProxyList
            proxies={filteredProxies}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onStartProxy={startProxy}
            onStopProxy={stopProxy}
            onEditProxy={(id: string) => toast.info(`${t('proxy.card.tooltips.edit')} ${id}`)}
            onDeleteProxy={(id: string) => {
              setProxyToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            onViewLogs={handleViewLogs}
            onCreateProxy={handleCreateProxy}
          />
        </div>
      </motion.div>

      <DeleteProxyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteProxy}
        onCancel={() => setProxyToDelete(null)}
      />

      <ProxyLogsDialog
        open={isLogsDialogOpen}
        onOpenChange={setIsLogsDialogOpen}
        logs={selectedProxyLogs}
      />

      <Toaster />
    </AppLayout>
  );
}
