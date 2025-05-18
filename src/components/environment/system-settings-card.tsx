import { Save, Settings, Folder, ThermometerIcon, MoonStar, SunMoon, Palette, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { powerScale, parallaxFadeIn, DURATION } from "./animation-constants";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SystemSettingsCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: true,
    redLightMode: false,
    dataLocation: "D:\\AstroData",
    temperatureUnit: "celsius"
  });

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // 模拟保存设置
    setTimeout(() => {
      setIsLoading(false);
      toast.success("设置已保存", {
        description: "系统设置已成功更新"
      });
    }, 1000);
  };

  return (
    <motion.div 
      variants={powerScale}
      whileHover="hover"
      className="w-full"
    >
      <Card className="overflow-hidden border-t-4 border-t-purple-500/50 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-background">
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 font-bold">
              系统设置
            </span>
          </CardTitle>
          <CardDescription className="flex items-center">
            <Palette className="h-3 w-3 mr-1 opacity-70" />
            配置系统级设置，优化天文软件体验
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 bg-gradient-to-b from-card to-background/80">
          <motion.div 
            className="flex items-center justify-between"
            variants={parallaxFadeIn}
            custom={0}
            whileHover={{ x: 2, transition: { duration: DURATION.quick } }}
          >
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <MoonStar className="h-4 w-4 mr-2 text-purple-500" />
                <span className="font-medium">所有应用使用深色模式</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                强制所有兼容的天文应用使用深色主题
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>在所有支持的应用中启用深色模式</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <Separator className="bg-purple-200/20" />

          <motion.div 
            className="flex items-center justify-between"
            variants={parallaxFadeIn}
            custom={1}
            whileHover={{ x: 2, transition: { duration: DURATION.quick } }}
          >
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <SunMoon className="h-4 w-4 mr-2 text-red-500" />
                <span className="font-medium">红光护眼模式</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                使用红色调配色方案，保护夜视能力
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch 
                  checked={settings.redLightMode}
                  onCheckedChange={(checked) => setSettings({...settings, redLightMode: checked})}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-red-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>启用红光模式，减少对夜视能力的影响</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <Separator className="bg-purple-200/20" />

          <motion.div 
            className="space-y-3"
            variants={parallaxFadeIn}
            custom={2}
            whileHover={{ y: -1, transition: { duration: DURATION.quick } }}
          >
            <Label className="flex items-center">
              <Folder className="h-4 w-4 mr-2 text-purple-500" />
              <span className="font-medium">默认数据存储位置</span>
            </Label>
            <div className="flex gap-2">
              <Input 
                value={settings.dataLocation} 
                onChange={(e) => setSettings({...settings, dataLocation: e.target.value})}
                className="flex-1 border-purple-200/30 focus:border-purple-500/50"
              />
              <Button variant="outline" className="border-purple-200/30 hover:bg-purple-500/10 hover:text-purple-600">浏览...</Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Info className="h-3 w-3 mr-1" />
              图像、数据和日志将保存在此文件夹中
            </p>
          </motion.div>

          <Separator className="bg-purple-200/20" />

          <motion.div 
            className="space-y-3"
            variants={parallaxFadeIn}
            custom={3}
            whileHover={{ y: -1, transition: { duration: DURATION.quick } }}
          >
            <Label className="flex items-center">
              <ThermometerIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span className="font-medium">温度单位</span>
            </Label>
            <Select
              value={settings.temperatureUnit}
              onValueChange={(value) => setSettings({...settings, temperatureUnit: value})}
            >
              <SelectTrigger className="border-purple-200/30 focus:border-purple-500/50 bg-card/80">
                <SelectValue placeholder="选择温度单位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">摄氏度 (°C)</SelectItem>
                <SelectItem value="fahrenheit">华氏度 (°F)</SelectItem>
                <SelectItem value="kelvin">开尔文 (K)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              此设置将应用于所有温度显示
            </p>
          </motion.div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-purple-500/10 to-background p-4 flex justify-between">
          <Button variant="outline" className="border-purple-200/30">
            恢复默认
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    保存设置
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>保存所有设置更改</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </motion.div>
  );
}