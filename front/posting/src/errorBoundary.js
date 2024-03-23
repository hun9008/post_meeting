import React from 'react';
import { Navigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
  
    static getDerivedStateFromError(error) {
      // 에러가 발생하면, state를 업데이트하여 다음 렌더링에서 대체 UI를 보여줄 수 있게 합니다.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
    //   console.error("Caught an error:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // 에러가 발생하면 특정 페이지로 리다이렉트합니다.
        return <Navigate to="/error" />;
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary;